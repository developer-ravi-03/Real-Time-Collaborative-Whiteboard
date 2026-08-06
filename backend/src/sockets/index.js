import { Server } from "socket.io";
import env from "../config/env.js";
import registerConnectionHandler from "./handlers/connection.handler.js";
import socketAuth from "./middleware/socketAuth.js";

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },

    transports: ["websocket"],
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    registerConnectionHandler(io, socket);
  });

  return io;
};
