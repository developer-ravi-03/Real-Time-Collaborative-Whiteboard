import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware.js";
import validateRequest from "../../middleware/validate.middleware.js";
import {
  closeSession,
  createRoom,
  deleteRoom,
  getMyRooms,
  getRoomById,
  reopenSession,
  updateRoom,
} from "./room.controller.js";
import { createRoomSchema, updateRoomSchema } from "./room.validation.js";
import {
  loadRoom,
  requireRoomMember,
  requireRoomAdmin,
  requireRoomOwner,
} from "./middleware/room.middleware.js";
import {
  joinRoomSchema,
  updateMemberRoleSchema,
} from "./room-member.validation.js";
import {
  getRoomMembers,
  joinRoom,
  leaveRoom,
  removeMember,
  updateMemberRole,
} from "./room-member.controller.js";

const router = Router();

router.post("/", requireAuth, validateRequest(createRoomSchema), createRoom);

router.post("/join", requireAuth, validateRequest(joinRoomSchema), joinRoom);

router.get("/my", requireAuth, getMyRooms);

router.get("/:roomId", requireAuth, loadRoom, requireRoomMember, getRoomById);

router.get(
  "/:roomId/members",
  requireAuth,
  loadRoom,
  requireRoomMember,
  getRoomMembers,
);

router.patch(
  "/:roomId",
  requireAuth,
  loadRoom,
  requireRoomAdmin,
  validateRequest(updateRoomSchema),
  updateRoom,
);

router.patch(
  "/:roomId/members/:memberId",
  requireAuth,
  loadRoom,
  requireRoomMember,
  validateRequest(updateMemberRoleSchema),
  updateMemberRole,
);

//close room
router.post(
  "/:roomId/close",
  requireAuth,
  loadRoom,
  requireRoomOwner,
  closeSession,
);

//reopen room
router.post(
  "/:roomId/reopen",
  requireAuth,
  loadRoom,
  requireRoomOwner,
  reopenSession,
);

router.delete("/:roomId", requireAuth, loadRoom, requireRoomOwner, deleteRoom);

router.delete(
  "/:roomId/leave",
  requireAuth,
  loadRoom,
  requireRoomMember,
  leaveRoom,
);

router.delete(
  "/:roomId/members/:memberId",
  requireAuth,
  loadRoom,
  requireRoomMember,
  removeMember,
);

export default router;
