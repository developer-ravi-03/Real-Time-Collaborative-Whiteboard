import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import roomRoutes from "../modules/room/room.routes.js";
import boardRoutes from "../modules/board/board.routes.js";

const router = Router();

router.use("/health", healthRoutes);

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/rooms", roomRoutes);

router.use("/", boardRoutes);

export default router;
