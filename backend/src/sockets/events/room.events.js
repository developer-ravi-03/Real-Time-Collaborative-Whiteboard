import RoomService from "../../modules/room/room.service.js";
import { addUser, getUsers, removeUser } from "../utils/presence.utils.js";
import BoardService from "../../modules/board/board.service.js";
import PageService from "../../modules/board/page.service.js";
import { emitCanvasInitialization } from "../utils/canvas.utils.js";
import { SOCKET_EVENTS } from "../constants/socket.events.js";

export default function registerRoomEvents(io, socket) {
  socket.on(SOCKET_EVENTS.ROOM_JOIN, async (payload, callback) => {
    try {
      if (typeof callback !== "function") {
        return;
      }

      const roomId =
        typeof payload?.roomId === "string" ? payload.roomId.trim() : "";

      if (!roomId) {
        return callback({
          success: false,
          message: "Room ID is required.",
        });
      }

      /* ---------------------------------------------------------------------- */
      /*                          Already Joined                                 */
      /* ---------------------------------------------------------------------- */

      if (socket.currentRoomId === roomId) {
        return callback({
          success: true,
          message: "Already joined this room.",
          users: getUsers(roomId),
        });
      }

      /* ---------------------------------------------------------------------- */
      /*                            Check Room                                   */
      /* ---------------------------------------------------------------------- */

      const room = await RoomService.getRoom(roomId);

      if (!room) {
        return callback({
          success: false,
          message: "Room not found.",
        });
      }

      /* ---------------------------------------------------------------------- */
      /*                           Check Membership                              */
      /* ---------------------------------------------------------------------- */

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

      /* ---------------------------------------------------------------------- */
      /*                    Leave Previous Room First                            */
      /* ---------------------------------------------------------------------- */

      if (socket.currentRoomId) {
        const previousRoomId = socket.currentRoomId;

        await socket.leave(previousRoomId);

        removeUser(previousRoomId, socket.id);

        io.to(previousRoomId).emit(
          SOCKET_EVENTS.PRESENCE_UPDATE,
          getUsers(previousRoomId),
        );

        socket.currentRoomId = null;
      }

      /* ---------------------------------------------------------------------- */
      /*                            Join Room                                    */
      /* ---------------------------------------------------------------------- */

      await socket.join(roomId);

      socket.currentRoomId = roomId;

      /* ---------------------------------------------------------------------- */
      /*                             Presence                                    */
      /* ---------------------------------------------------------------------- */

      addUser(roomId, socket);

      const users = getUsers(roomId);

      io.to(roomId).emit(SOCKET_EVENTS.PRESENCE_UPDATE, users);

      /* ---------------------------------------------------------------------- */
      /*                     OPTIONAL BOARD INITIALIZATION                      */
      /* ---------------------------------------------------------------------- */

      /*
       * IMPORTANT:
       *
       * Room membership does NOT require a board.
       *
       * A newly created room can legitimately have:
       *
       *     boards = []
       *
       * Therefore we use findFirstBoard(), which returns
       * null instead of throwing when no board exists.
       */

      const board = await BoardService.findFirstBoard(roomId);

      if (board) {
        /*
         * Same rule for pages.
         *
         * A board normally gets its first page during board
         * creation, but room joining must remain resilient
         * even if a page is temporarily unavailable.
         */

        const page = await PageService.findFirstPage(board.id);

        if (page) {
          emitCanvasInitialization(socket, board, page);
        } else {
          console.info(`[Socket] Board ${board.id} has no page yet.`);
        }
      } else {
        console.info(`[Socket] Room ${roomId} has no board yet.`);
      }

      /* ---------------------------------------------------------------------- */
      /*                              Success                                    */
      /* ---------------------------------------------------------------------- */

      return callback({
        success: true,
        message: "Joined room successfully.",
        users,
      });
    } catch (error) {
      console.error("[Socket] Failed to join room:", error);

      return callback({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to join room.",
      });
    }
  });

  /* ------------------------------------------------------------------------ */
  /*                              ROOM LEAVE                                  */
  /* ------------------------------------------------------------------------ */

  socket.on(SOCKET_EVENTS.ROOM_LEAVE, async (_data, callback) => {
    try {
      if (typeof callback !== "function") {
        return;
      }

      if (!socket.currentRoomId) {
        return callback({
          success: false,
          message: "Not inside any room.",
        });
      }

      const roomId = socket.currentRoomId;

      await socket.leave(roomId);

      removeUser(roomId, socket.id);

      socket.currentRoomId = null;

      const users = getUsers(roomId);

      io.to(roomId).emit(SOCKET_EVENTS.PRESENCE_UPDATE, users);

      return callback({
        success: true,
        message: "Left room successfully.",
      });
    } catch (error) {
      console.error("[Socket] Failed to leave room:", error);

      return callback({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to leave room.",
      });
    }
  });

  /* ------------------------------------------------------------------------ */
  /*                            PRESENCE GET                                  */
  /* ------------------------------------------------------------------------ */

  socket.on(SOCKET_EVENTS.PRESENCE_GET, (callback) => {
    if (typeof callback !== "function") {
      return;
    }

    if (!socket.currentRoomId) {
      return callback([]);
    }

    return callback(getUsers(socket.currentRoomId));
  });
}
