import { removeUser, getUsers } from "../utils/presence.utils.js";
import registerRoomEvents from "../events/room.events.js";
import registerCanvasEvents from "./canvas.events.js";
import registerPageEvents from "./page.handler.js";
import registerBoardEvents from "./board.handler.js";
import registerSessionEvents from "./session.handler.js";

export default function registerConnectionHandler(io, socket) {
  console.log(`✅ ${socket.user.displayName} connected (${socket.id})`);

  registerRoomEvents(io, socket);
  registerCanvasEvents(io, socket);
  registerPageEvents(io, socket);
  registerBoardEvents(io, socket);
  registerSessionEvents(io, socket);

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
