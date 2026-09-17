import { SOCKET_EVENTS } from "../constants/socket.events.js";
import { ensureJoinedRoom } from "../utils/socket-auth.utils.js";

const MEMBER_ROLE_ACTIONS = new Set(["role-updated"]);

export default function registerMemberEvents(io, socket) {
  /* -------------------------------------------------------------------------- */
  /*                           Member Role Change                               */
  /* -------------------------------------------------------------------------- */

  socket.on(SOCKET_EVENTS.MEMBER_ROLE_CHANGE, async (data, callback) => {
    try {
      if (typeof callback !== "function") {
        callback = () => {};
      }

      if (!ensureJoinedRoom(socket, callback)) {
        return;
      }

      const memberId =
        typeof data?.memberId === "string" ? data.memberId.trim() : "";

      const role = typeof data?.role === "string" ? data.role.trim() : "";

      const action = typeof data?.action === "string" ? data.action.trim() : "";

      if (!memberId) {
        return callback({
          success: false,
          message: "Member ID is required.",
        });
      }

      if (!role) {
        return callback({
          success: false,
          message: "Member role is required.",
        });
      }

      if (!MEMBER_ROLE_ACTIONS.has(action)) {
        return callback({
          success: false,
          message: "Invalid member action.",
        });
      }

      socket.to(socket.currentRoomId).emit(SOCKET_EVENTS.MEMBER_ROLE_CHANGED, {
        memberId,
        role,
        action,
        userId: socket.user.id,
      });

      return callback({
        success: true,
      });
    } catch (error) {
      console.error("[Socket] Member role change failed:", error);

      return callback({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to broadcast member role change.",
      });
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                              Member Removed                                */
  /* -------------------------------------------------------------------------- */

  socket.on(SOCKET_EVENTS.MEMBER_REMOVE, async (data, callback) => {
    try {
      if (typeof callback !== "function") {
        callback = () => {};
      }

      if (!ensureJoinedRoom(socket, callback)) {
        return;
      }

      const roomId = socket.currentRoomId;

      const memberId =
        typeof data?.memberId === "string" ? data.memberId.trim() : "";

      const userId = typeof data?.userId === "string" ? data.userId.trim() : "";

      if (!memberId) {
        return callback({
          success: false,
          message: "Member ID is required.",
        });
      }

      if (!userId) {
        return callback({
          success: false,
          message: "Removed user ID is required.",
        });
      }

      /*
       * REST DELETE has already completed the database mutation.
       *
       * Socket.IO is responsible for synchronizing connected clients.
       */

      const removedPayload = {
        roomId,
        memberId,
        userId,
        removedBy: {
          id: socket.user.id,
          displayName: socket.user.displayName,
        },
      };

      /*
       * --------------------------------------------------------------
       * Find every active socket belonging to the removed user.
       * --------------------------------------------------------------
       *
       * A user can have multiple tabs/devices open.
       * We therefore handle ALL matching sockets.
       */

      const roomSockets = await io.in(roomId).fetchSockets();

      const removedSockets = roomSockets.filter(
        (candidateSocket) => candidateSocket.user?.id === userId,
      );

      /*
       * --------------------------------------------------------------
       * Notify + remove target sockets
       * --------------------------------------------------------------
       */

      for (const removedSocket of removedSockets) {
        /*
         * Send the event BEFORE leaving the room.
         *
         * kicked=true is important because this event is
         * specifically for the removed user.
         */

        removedSocket.emit(SOCKET_EVENTS.MEMBER_REMOVED, {
          ...removedPayload,
          kicked: true,
        });

        /*
         * Remove the socket from the Socket.IO room.
         */

        await removedSocket.leave(roomId);

        /*
         * Keep the socket's custom room state consistent.
         */

        removedSocket.currentRoomId = null;
      }

      /*
       * --------------------------------------------------------------
       * Notify remaining users
       * --------------------------------------------------------------
       */

      socket.to(roomId).emit(SOCKET_EVENTS.MEMBER_REMOVED, {
        ...removedPayload,
        kicked: false,
      });

      /*
       * --------------------------------------------------------------
       * Rebuild realtime presence from the remaining sockets.
       * --------------------------------------------------------------
       *
       * We intentionally do NOT use the deleted database membership
       * here. Presence represents currently connected sockets.
       */

      const remainingSockets = await io.in(roomId).fetchSockets();

      const usersById = new Map();

      for (const roomSocket of remainingSockets) {
        const roomUser = roomSocket.user;

        if (!roomUser?.id) {
          continue;
        }

        if (usersById.has(roomUser.id)) {
          continue;
        }

        usersById.set(roomUser.id, {
          userId: roomUser.id,
          displayName: roomUser.displayName ?? null,
          imageUrl: roomUser.imageUrl ?? null,
        });
      }

      io.to(roomId).emit(
        SOCKET_EVENTS.PRESENCE_UPDATE,
        Array.from(usersById.values()),
      );

      return callback({
        success: true,
      });
    } catch (error) {
      console.error("[Socket] Member removal failed:", error);

      return callback({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to broadcast member removal.",
      });
    }
  });
}
