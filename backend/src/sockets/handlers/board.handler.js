import BoardService from "../../modules/board/board.service.js";
import PageService from "../../modules/board/page.service.js";
import { emitCanvasInitialization } from "../utils/canvas.utils.js";
import { SOCKET_EVENTS } from "../constants/socket.events.js";
import {
  ensureJoinedRoom,
  ensureSameRoom,
} from "../utils/socket-auth.utils.js";

export default function registerBoardEvents(io, socket) {
  socket.on(SOCKET_EVENTS.BOARD_CHANGE, async ({ boardId }, callback) => {
    try {
      /* -------------------------------------------------------------------------- */
      /*                           Room Validation                                  */
      /* -------------------------------------------------------------------------- */

      if (!ensureJoinedRoom(socket, callback)) return;

      /* -------------------------------------------------------------------------- */
      /*                              Load Board                                    */
      /* -------------------------------------------------------------------------- */

      const board = await BoardService.getBoardInitialization(boardId);

      /* -------------------------------------------------------------------------- */
      /*                           Security Check                                   */
      /* -------------------------------------------------------------------------- */

      if (!ensureSameRoom(socket, board.roomId, callback)) return;

      /* -------------------------------------------------------------------------- */
      /*                           First Page                                       */
      /* -------------------------------------------------------------------------- */

      const page = await PageService.getFirstPage(board.id);

      /* -------------------------------------------------------------------------- */
      /*                           Canvas Init                                      */
      /* -------------------------------------------------------------------------- */

      emitCanvasInitialization(socket, board, page);

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
