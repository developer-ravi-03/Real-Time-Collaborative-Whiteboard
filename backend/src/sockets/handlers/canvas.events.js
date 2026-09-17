import PageService from "../../modules/board/page.service.js";
import RoomService from "../../modules/room/room.service.js";

import { SOCKET_EVENTS } from "../constants/socket.events.js";

import {
  ensureJoinedRoom,
  ensureSameRoom,
} from "../utils/socket-auth.utils.js";

/*
 * ==========================================================
 * CANVAS DATA VALIDATION
 * ==========================================================
 */

function isValidCanvasData(canvasData) {
  if (!canvasData || typeof canvasData !== "object") {
    return false;
  }

  if (!Array.isArray(canvasData.objects)) {
    return false;
  }

  return true;
}

/*
 * ==========================================================
 * CANVAS EVENTS
 * ==========================================================
 */

export default function registerCanvasEvents(io, socket) {
  /*
   * ========================================================
   * LIVE CANVAS UPDATE
   * ========================================================
   *
   * This event is ONLY for realtime synchronization.
   *
   * It does NOT save to PostgreSQL.
   *
   * REST autosave remains responsible for persistence.
   * ========================================================
   */

  socket.on(SOCKET_EVENTS.CANVAS_UPDATE, async (data, callback) => {
    try {
      if (typeof callback !== "function") {
        callback = () => {};
      }

      /*
       * ----------------------------------------------------
       * Authentication / Room
       * ----------------------------------------------------
       */

      if (!ensureJoinedRoom(socket, callback)) {
        return;
      }

      const pageId = typeof data?.pageId === "string" ? data.pageId.trim() : "";

      const canvasData = data?.canvasData;

      if (!pageId) {
        return callback({
          success: false,
          message: "Page ID is required.",
        });
      }

      /*
       * ----------------------------------------------------
       * Canvas Validation
       * ----------------------------------------------------
       */

      if (!isValidCanvasData(canvasData)) {
        return callback({
          success: false,
          message: "Invalid canvas data.",
        });
      }

      /*
       * ----------------------------------------------------
       * Page Validation
       * ----------------------------------------------------
       */

      const page = await PageService.getPage(pageId);

      if (!page) {
        return callback({
          success: false,
          message: "Page not found.",
        });
      }

      /*
       * ----------------------------------------------------
       * Room Validation
       * ----------------------------------------------------
       */

      if (!ensureSameRoom(socket, page.board.roomId, callback)) {
        return;
      }

      /*
       * ----------------------------------------------------
       * Permission Validation
       * ----------------------------------------------------
       *
       * VIEWER can receive realtime updates but cannot
       * broadcast canvas mutations.
       */

      const membership = await RoomService.getMembership(
        socket.currentRoomId,
        socket.user.id,
      );

      if (!membership) {
        return callback({
          success: false,
          message: "Access denied.",
        });
      }

      if (membership.role === "VIEWER") {
        return callback({
          success: false,
          message: "You do not have permission to edit this canvas.",
        });
      }

      /*
       * ----------------------------------------------------
       * Broadcast
       * ----------------------------------------------------
       *
       * socket.to() means:
       *
       * sender       ❌
       * other users  ✅
       *
       * This prevents the sender from receiving its own
       * update back.
       */

      socket.to(socket.currentRoomId).emit(SOCKET_EVENTS.CANVAS_UPDATED, {
        pageId,
        canvasData,
        userId: socket.user.id,
      });

      return callback({
        success: true,
      });
    } catch (error) {
      console.error("[Socket] Canvas update failed:", error);

      return callback({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update canvas.",
      });
    }
  });

  /*
   * ========================================================
   * CANVAS SAVE
   * ========================================================
   *
   * Kept as a separate persistence operation.
   *
   * High-frequency canvas:update MUST NOT hit PostgreSQL.
   * ========================================================
   */

  socket.on(SOCKET_EVENTS.CANVAS_SAVE, async (data, callback) => {
    try {
      if (typeof callback !== "function") {
        return;
      }

      const { pageId, canvasData } = data ?? {};

      /*
       * ----------------------------------------------------
       * Room Validation
       * ----------------------------------------------------
       */

      if (!socket.currentRoomId) {
        return callback({
          success: false,
          message: "Join a room first.",
        });
      }

      /*
       * ----------------------------------------------------
       * Canvas Validation
       * ----------------------------------------------------
       */

      if (!isValidCanvasData(canvasData)) {
        return callback({
          success: false,
          message: "Invalid canvas data.",
        });
      }

      /*
       * ----------------------------------------------------
       * Page Validation
       * ----------------------------------------------------
       */

      const page = await PageService.getPage(pageId);

      if (!page) {
        return callback({
          success: false,
          message: "Page not found.",
        });
      }

      if (page.board.roomId !== socket.currentRoomId) {
        return callback({
          success: false,
          message: "Access denied.",
        });
      }

      /*
       * ----------------------------------------------------
       * Permission
       * ----------------------------------------------------
       */

      const membership = await RoomService.getMembership(
        socket.currentRoomId,
        socket.user.id,
      );

      if (!membership || membership.role === "VIEWER") {
        return callback({
          success: false,
          message: "You do not have permission to save this canvas.",
        });
      }

      /*
       * ----------------------------------------------------
       * Database Save
       * ----------------------------------------------------
       */

      const updatedPage = await PageService.saveCanvas(pageId, canvasData);

      return callback({
        success: true,
        version: updatedPage.version,
      });
    } catch (error) {
      console.error("[Socket] Canvas save failed:", error);

      return callback({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to save canvas.",
      });
    }
  });
}
