import http from "http";

import app from "./app.js";
import env from "./config/env.js";
import { initializeSocket } from "./sockets/index.js";

const server = http.createServer(app);

initializeSocket(server);

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
