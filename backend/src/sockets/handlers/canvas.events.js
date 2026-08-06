import PageService from "../../modules/board/page.service.js";
import { SOCKET_EVENTS } from "../constants/socket.events.js";
import {
  ensureJoinedRoom,
  ensureSameRoom,
} from "../utils/socket-auth.utils.js";

export default function registerCanvasEvents(io, socket) {
  socket.on(SOCKET_EVENTS.CANVAS_UPDATE, async ({ pageId, canvasData }) => {
    if (!socket.currentRoomId) {
      return;
    }

    const page = await PageService.getPage(pageId);

    if (!page) {
      return;
    }

    if (!ensureJoinedRoom(socket, callback)) return;

    if (!ensureSameRoom(socket, page.board.roomId, callback)) return;

    socket.to(socket.currentRoomId).emit(SOCKET_EVENTS.CANVAS_UPDATED, {
      pageId,
      canvasData,
    });
  });

  socket.on(SOCKET_EVENTS.CANVAS_SAVE, async (data, callback) => {
    try {
      const { pageId, canvasData } = data;

      /* -------------------------------------------------------------------------- */
      /*                           Room Validation                                  */
      /* -------------------------------------------------------------------------- */

      if (!socket.currentRoomId) {
        return callback({
          success: false,
          message: "Join a room first.",
        });
      }

      /* -------------------------------------------------------------------------- */
      /*                            Page Validation                                 */
      /* -------------------------------------------------------------------------- */

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

      /* -------------------------------------------------------------------------- */
      /*                              Save Canvas                                   */
      /* -------------------------------------------------------------------------- */

      const updatedPage = await PageService.saveCanvas(pageId, canvasData);

      callback({
        success: true,
        version: updatedPage.version,
      });
    } catch (error) {
      callback({
        success: false,
        message: error.message,
      });
    }
  });
}
