import { Router } from "express";

import {
  currentDatabaseUser,
  updateProfile,
  searchUsers,
} from "./user.controller.js";

import { requireAuth } from "../auth/auth.middleware.js";

import validateRequest from "../../middleware/validate.middleware.js";

import { updateProfileSchema, searchUsersSchema } from "./user.validation.js";

const router = Router();

router.get(
  "/search",
  requireAuth,
  validateRequest(searchUsersSchema, "query"),
  searchUsers,
);

router.get("/me", requireAuth, currentDatabaseUser);

router.patch(
  "/profile",
  requireAuth,
  validateRequest(updateProfileSchema),
  updateProfile,
);

export default router;
