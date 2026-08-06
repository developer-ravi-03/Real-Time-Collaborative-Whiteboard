import RoomService from "../../modules/room/room.service.js";
import { addUser, getUsers, removeUser } from "../utils/presence.utils.js";
import BoardService from "../../modules/board/board.service.js";
import PageService from "../../modules/board/page.service.js";
import { emitCanvasInitialization } from "../utils/canvas.utils.js";
import { SOCKET_EVENTS } from "../constants/socket.events.js";

export default function registerRoomEvents(io, socket) {
  socket.on(SOCKET_EVENTS.ROOM_JOIN, async ({ roomId }, callback) => {
    try {
      /* -------------------------------------------------------------------------- */
      /*                            Check Room Exists                               */
      /* -------------------------------------------------------------------------- */

      const room = await RoomService.getRoom(roomId);

      if (!room) {
        return callback({
          success: false,
          message: "Room not found.",
        });
      }

      /* -------------------------------------------------------------------------- */
      /*                          Check Membership                                  */
      /* -------------------------------------------------------------------------- */

      const membership = await RoomService.getMembership(
        roomId,
        socket.user.id,
      );

      if (!membership) {
        return callback({
          success: false,
          message: "Access denied.",
        });
      }

      /* -------------------------------------------------------------------------- */
      /*                              Join Socket Room                              */
      /* -------------------------------------------------------------------------- */

      await socket.join(roomId);

      socket.currentRoomId = roomId;

      /* ------------------------ Presence ------------------------ */

      addUser(roomId, socket);

      const users = getUsers(roomId);

      /* -------------------------------------------------------------------------- */
      /*                           Canvas Initialization                            */
      /* -------------------------------------------------------------------------- */

      const board = await BoardService.getFirstBoard(roomId);

      const page = await PageService.getFirstPage(board.id);

      emitCanvasInitialization(socket, board, page);

      /* ---------------------- Broadcast ------------------------- */

      io.to(roomId).emit(SOCKET_EVENTS.PRESENCE_UPDATE, users);

      /* ------------------------ Callback ------------------------- */

      callback({
        success: true,
        message: "Joined room successfully.",
        users,
      });
    } catch (error) {
      callback({
        success: false,
        message: error.message,
      });
    }
  });

  socket.on(SOCKET_EVENTS.ROOM_LEAVE, async (_data, callback) => {
    try {
      if (!socket.currentRoomId) {
        return callback({
          success: false,
          message: "Not inside any room.",
        });
      }

      const roomId = socket.currentRoomId;

      await socket.leave(roomId);

      removeUser(roomId, socket.id);

      const users = getUsers(roomId);

      io.to(roomId).emit(SOCKET_EVENTS.PRESENCE_UPDATE, users);

      socket.currentRoomId = null;

      callback({
        success: true,
        message: "Left room successfully.",
      });
    } catch (error) {
      callback({
        success: false,
        message: error.message,
      });
    }
  });

  socket.on(SOCKET_EVENTS.PRESENCE_GET, (callback) => {
    if (!socket.currentRoomId) {
      return callback([]);
    }

    callback(getUsers(socket.currentRoomId));
  });
}
