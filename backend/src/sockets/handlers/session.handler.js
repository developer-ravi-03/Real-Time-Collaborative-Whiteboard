import RoomService from "../../modules/room/room.service.js";
import { SOCKET_EVENTS } from "../constants/socket.events.js";
import {
  ensureJoinedRoom,
  ensureRoomOwner,
  ensureSameRoom,
} from "../utils/socket-auth.utils.js";

export default function registerSessionEvents(io, socket) {
  /* -------------------------------------------------------------------------- */
  /*                              Close Session                                 */
  /* -------------------------------------------------------------------------- */

  socket.on(SOCKET_EVENTS.SESSION_CLOSE, async ({ roomId }, callback) => {
    try {
      // Step 1
      if (!socket.currentRoomId) {
        return callback({
          success: false,
          message: "Join a room first.",
        });
      }

      // Step 2
      if (socket.currentRoomId !== roomId) {
        return callback({
          success: false,
          message: "Access denied.",
        });
      }

      // Step 3
      const room = await RoomService.getRoom(roomId);

      if (!room) {
        return callback({
          success: false,
          message: "Room not found.",
        });
      }

      // Step 4
      if (room.ownerId !== socket.user.id) {
        return callback({
          success: false,
          message: "Only owner can close session.",
        });
      }

      // Step 5
      await RoomService.closeSession(roomId);

      // Step 6

      io.to(roomId).emit(SOCKET_EVENTS.SESSION_CLOSED, {
        roomId,

        closedBy: {
          id: socket.user.id,
          displayName: socket.user.displayName,
        },
      });

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

  /* -------------------------------------------------------------------------- */
  /*                             Reopen Session                                 */
  /* -------------------------------------------------------------------------- */

  socket.on(SOCKET_EVENTS.SESSION_REOPEN, async ({ roomId }, callback) => {
    try {
      if (!ensureJoinedRoom(socket, callback)) return;

      if (!ensureSameRoom(socket, roomId, callback)) return;

      const room = await RoomService.getRoom(roomId);

      if (!room) {
        return callback({
          success: false,
          message: "Room not found.",
        });
      }

      if (!ensureRoomOwner(socket, room, callback)) return;

      await RoomService.reopenSession(roomId);

      io.to(roomId).emit(SOCKET_EVENTS.SESSION_REOPENED, {
        roomId,
        reopenedBy: {
          id: socket.user.id,
          displayName: socket.user.displayName,
        },
      });

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
