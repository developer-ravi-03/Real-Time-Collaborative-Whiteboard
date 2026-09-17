import { SOCKET_EVENTS } from "../constants/socket.events.js";

import {
  ensureJoinedRoom,
  ensureSameRoom,
} from "../utils/socket-auth.utils.js";

import BoardService from "../../modules/board/board.service.js";

const BOARD_ACTIONS = new Set(["created", "updated", "deleted"]);

export default function registerBoardEvents(io, socket) {
  socket.on(SOCKET_EVENTS.BOARD_CHANGE, async (data, callback) => {
    try {
      /*
       * ======================================================
       * CALLBACK
       * ======================================================
       */

      if (typeof callback !== "function") {
        callback = () => {};
      }

      /*
       * ======================================================
       * ROOM VALIDATION
       * ======================================================
       */

      if (!ensureJoinedRoom(socket, callback)) {
        return;
      }

      /*
       * ======================================================
       * PAYLOAD
       * ======================================================
       */

      const boardId =
        typeof data?.boardId === "string" ? data.boardId.trim() : "";

      const action = typeof data?.action === "string" ? data.action.trim() : "";

      if (!boardId) {
        return callback({
          success: false,
          message: "Board ID is required.",
        });
      }

      if (!BOARD_ACTIONS.has(action)) {
        return callback({
          success: false,
          message: "Invalid board action.",
        });
      }

      /*
       * ======================================================
       * BOARD VALIDATION
       * ======================================================
       *
       * For created/updated boards the board must exist.
       *
       * For deleted boards it is already gone from DB,
       * therefore we only validate the room membership.
       */

      if (action !== "deleted") {
        const board = await BoardService.getBoard(boardId);

        if (!board) {
          return callback({
            success: false,
            message: "Board not found.",
          });
        }

        if (!ensureSameRoom(socket, board.roomId, callback)) {
          return;
        }
      }

      /*
       * ======================================================
       * BROADCAST
       * ======================================================
       *
       * socket.to(...)
       *
       * sender       ❌
       * other users  ✅
       */

      socket.to(socket.currentRoomId).emit(SOCKET_EVENTS.BOARD_CHANGED, {
        boardId,
        action,
        userId: socket.user.id,
      });

      /*
       * ======================================================
       * ACK
       * ======================================================
       */

      return callback({
        success: true,
      });
    } catch (error) {
      console.error("[Socket] Board change failed:", error);

      return callback({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to broadcast board change.",
      });
    }
  });
}
