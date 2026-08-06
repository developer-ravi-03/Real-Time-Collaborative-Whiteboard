import { io } from "socket.io-client";

const ROOM_ID = "cmsae1qf80000oo9mi2eiipf7";
const BOARD_ID = "cmsg3ev4v0006nk9m8xbb2m72";
const PAGE_ID = "cmsg4jfhj0002eo9mnocani91";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

function emitAsync(event, data = {}) {
  return new Promise((resolve) => {
    socket.emit(event, data, resolve);
  });
}

socket.on("presence:update", (users) => {
  console.log("\n🟢 PRESENCE UPDATE");
  console.log(users);
});

socket.on("canvas:init", (data) => {
  console.log("\n🎨 CANVAS INIT");
  console.log({
    board: data.board.name,
    page: data.page.pageNumber,
    version: data.page.version,
  });
});

socket.on("canvas:updated", (data) => {
  console.log("\n✏️ CANVAS UPDATED");
  console.log(data.pageId);
});

socket.on("session:closed", (data) => {
  console.log("\n🔒 SESSION CLOSED");
  console.log(data);
});

socket.on("session:reopened", (data) => {
  console.log("\n🔓 SESSION REOPENED");
  console.log(data);
});

socket.on("connect", async () => {
  console.log("\n==============================");
  console.log("✅ SOCKET CONNECTED");
  console.log("==============================");

  /* ---------------- ROOM JOIN ---------------- */

  let result = await emitAsync("room:join", {
    roomId: ROOM_ID,
  });

  console.log("\nROOM JOIN");
  console.log(result);

  /* ---------------- PRESENCE ---------------- */

  result = await new Promise((resolve) => {
    socket.emit("presence:get", resolve);
  });

  console.log("\nONLINE USERS");
  console.log(result);

  /* ---------------- PAGE CHANGE ---------------- */

  result = await emitAsync("page:change", {
    pageId: PAGE_ID,
  });

  console.log("\nPAGE CHANGE");
  console.log(result);

  /* ---------------- BOARD CHANGE ---------------- */

  result = await emitAsync("board:change", {
    boardId: BOARD_ID,
  });

  console.log("\nBOARD CHANGE");
  console.log(result);

  /* ---------------- CANVAS SAVE ---------------- */

  const canvasData = {
    version: "6.0.0",
    objects: [
      {
        type: "rect",
        left: 100,
        top: 100,
        width: 150,
        height: 100,
        fill: "red",
      },
    ],
  };

  result = await emitAsync("canvas:save", {
    pageId: PAGE_ID,
    canvasData,
  });

  console.log("\nCANVAS SAVE");
  console.log(result);

  /* ---------------- SESSION CLOSE ---------------- */

  result = await emitAsync("session:close", {
    roomId: ROOM_ID,
  });

  console.log("\nSESSION CLOSE");
  console.log(result);

  /* ---------------- SESSION REOPEN ---------------- */

  result = await emitAsync("session:reopen", {
    roomId: ROOM_ID,
  });

  console.log("\nSESSION REOPEN");
  console.log(result);

  /* ---------------- ROOM LEAVE ---------------- */

  result = await emitAsync("room:leave");

  console.log("\nROOM LEAVE");
  console.log(result);

  console.log("\n==============================");
  console.log("🎉 ALL TESTS COMPLETED");
  console.log("==============================");

  socket.disconnect();
});
