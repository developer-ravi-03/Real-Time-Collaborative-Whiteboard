import registerRoomEvents from "../events/room.events.js";
import { removeUser, getUsers } from "../utils/presence.utils.js";

export default function registerConnectionHandler(io, socket) {
  console.log(`✅ ${socket.user.displayName} connected (${socket.id})`);

  registerRoomEvents(io, socket);

  socket.on("disconnect", () => {
    console.log(`❌ ${socket.user.displayName} disconnected`);

    if (!socket.currentRoomId) {
      return;
    }

    removeUser(socket.currentRoomId, socket.id);

    const users = getUsers(socket.currentRoomId);

    io.to(socket.currentRoomId).emit("presence:update", users);
  });
}
