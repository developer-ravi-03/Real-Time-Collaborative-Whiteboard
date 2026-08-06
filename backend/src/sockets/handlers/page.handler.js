import PageService from "../../modules/board/page.service.js";
import { emitCanvasInitialization } from "../utils/canvas.utils.js";
import { SOCKET_EVENTS } from "../constants/socket.events.js";
import {
  ensureJoinedRoom,
  ensureSameRoom,
} from "../utils/socket-auth.utils.js";

export default function registerPageEvents(io, socket) {
  socket.on(SOCKET_EVENTS.PAGE_CHANGE, async ({ pageId }, callback) => {
    try {
      /* -------------------------------------------------------------------------- */
      /*                              Load Page                                     */
      /* -------------------------------------------------------------------------- */

      const page = await PageService.getPage(pageId);

      if (!page) {
        return callback({
          success: false,
          message: "Page not found.",
        });
      }

      /* -------------------------------------------------------------------------- */
      /*                          Room Validation                                   */
      /* -------------------------------------------------------------------------- */

      if (!ensureJoinedRoom(socket, callback)) return;

      if (!ensureSameRoom(socket, page.board.roomId, callback)) return;

      /* -------------------------------------------------------------------------- */
      /*                           Canvas Init                                      */
      /* -------------------------------------------------------------------------- */

      emitCanvasInitialization(socket, page.board, page);

      callback({
        success: true,
      });
    } catch (error) {
      callback({
        success: false,
        message: error.message,
      });
    }
  });
}
