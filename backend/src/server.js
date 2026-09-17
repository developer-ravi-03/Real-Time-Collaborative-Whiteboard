import http from "http";

import app from "./app.js";
import env from "./config/env.js";
import { initializeSocket } from "./sockets/index.js";

const server = http.createServer(app);

const io = initializeSocket(server);

/*
 * Make Socket.IO available to REST controllers through
 * req.app.get("io").
 *
 * This allows a successful REST mutation to immediately
 * notify connected clients without making Socket.IO the
 * source of truth for the database mutation.
 */
app.set("io", io);

server.listen(env.PORT, () => {
  console.log(`
==========================================
🚀 SyncBoard Backend Started Successfully
==========================================
🌍 Environment : ${env.NODE_ENV}
📦 Port        : ${env.PORT}
==========================================
`);
});
