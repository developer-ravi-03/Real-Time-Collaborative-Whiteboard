import { SOCKET_EVENTS } from "../constants/socket.events.js";
import { ensureJoinedRoom } from "../utils/socket-auth.utils.js";

const MEMBER_ACTIONS = new Set(["role-updated"]);

export default function registerMemberEvents(io, socket) {
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

      if (!MEMBER_ACTIONS.has(action)) {
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
}
