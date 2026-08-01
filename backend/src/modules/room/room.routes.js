import { Router } from "express";

import { requireAuth } from "../auth/auth.middleware.js";

import validateRequest from "../../middleware/validate.middleware.js";

import { createRoom, getMyRooms, getRoomById } from "./room.controller.js";
import { createRoomSchema } from "./room.validation.js";
import { loadRoom, requireRoomMember } from "./middleware/room.middleware.js";

const router = Router();

router.post("/", requireAuth, validateRequest(createRoomSchema), createRoom);

router.get("/my", requireAuth, getMyRooms);

// router.get("/:roomId", requireAuth, getRoomById);
router.get("/:roomId", requireAuth, loadRoom, requireRoomMember, getRoomById);

export default router;
