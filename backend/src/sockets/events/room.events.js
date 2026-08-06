import RoomService from "../../modules/room/room.service.js";
import { addUser, getUsers } from "../utils/presence.utils.js";

export default function registerRoomEvents(io, socket) {
  socket.on("room:join", async ({ roomId }, callback) => {
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

      await socket.join(roomId);

      socket.currentRoomId = roomId;

      /* ------------------------ Presence ------------------------ */

      addUser(roomId, socket);

      const users = getUsers(roomId);

      /* ---------------------- Broadcast ------------------------- */

      io.to(roomId).emit("presence:update", users);

      /* ------------------------ Callback ------------------------- */

      callback({
        success: true,
        message: "Joined room successfully.",
        users,
      });

      socket.currentRoomId = roomId;

      callback({
        success: true,
        message: "Joined room successfully.",
      });
    } catch (error) {
      callback({
        success: false,
        message: error.message,
      });
    }
  });

  socket.on("presence:get", (callback) => {
    if (!socket.currentRoomId) {
      return callback([]);
    }

    callback(getUsers(socket.currentRoomId));
  });
}
