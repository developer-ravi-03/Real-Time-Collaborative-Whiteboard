import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware.js";
import validateRequest from "../../middleware/validate.middleware.js";
import {
  createRoom,
  deleteRoom,
  getMyRooms,
  getRoomById,
  updateRoom,
} from "./room.controller.js";
import { createRoomSchema, updateRoomSchema } from "./room.validation.js";
import {
  loadRoom,
  requireRoomMember,
  requireRoomAdmin,
  requireRoomOwner,
} from "./middleware/room.middleware.js";

const router = Router();

router.post("/", requireAuth, validateRequest(createRoomSchema), createRoom);

router.get("/my", requireAuth, getMyRooms);

// router.get("/:roomId", requireAuth, getRoomById);
router.get("/:roomId", requireAuth, loadRoom, requireRoomMember, getRoomById);

router.patch(
  "/:roomId",
  requireAuth,
  loadRoom,
  requireRoomAdmin,
  validateRequest(updateRoomSchema),
  updateRoom,
);

router.delete("/:roomId", requireAuth, loadRoom, requireRoomOwner, deleteRoom);

export default router;
