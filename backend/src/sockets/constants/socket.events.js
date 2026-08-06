export const SOCKET_EVENTS = {
  /* ---------------- Room ---------------- */

  ROOM_JOIN: "room:join",
  ROOM_LEAVE: "room:leave",

  /* ---------------- Presence ---------------- */

  PRESENCE_GET: "presence:get",
  PRESENCE_UPDATE: "presence:update",

  /* ---------------- Canvas ---------------- */

  CANVAS_INIT: "canvas:init",
  CANVAS_UPDATE: "canvas:update",
  CANVAS_UPDATED: "canvas:updated",
  CANVAS_SAVE: "canvas:save",

  /* ---------------- Pages ---------------- */

  PAGE_CHANGE: "page:change",

  /* ---------------- Boards ---------------- */

  BOARD_CHANGE: "board:change",

  /* ---------------- Sessions ---------------- */

  SESSION_CLOSE: "session:close",
  SESSION_CLOSED: "session:closed",

  SESSION_REOPEN: "session:reopen",
  SESSION_REOPENED: "session:reopened",
};
