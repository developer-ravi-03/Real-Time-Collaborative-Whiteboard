import { Router } from "express";

import { requireAuth } from "../auth/auth.middleware.js";

import validateRequest from "../../middleware/validate.middleware.js";

import {
  createBoard,
  getBoardsByRoom,
  getBoardById,
  updateBoard,
  deleteBoard,
} from "./board.controller.js";

import {
  createPage,
  getPages,
  getPageById,
  updatePage,
  deletePage,
} from "./page.controller.js";

import { createBoardSchema, updateBoardSchema } from "./board.validation.js";

import { createPageSchema, updatePageSchema } from "./page.validation.js";

import {
  loadRoom,
  requireRoomMember,
  requireRoomEditor,
  requireRoomAdmin,
  requireRoomOwner,
} from "../room/middleware/room.middleware.js";

import { loadBoard } from "./middleware/board.middleware.js";
import { loadPage } from "./middleware/page.middleware.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                   Boards                                   */
/* -------------------------------------------------------------------------- */

router.post(
  "/rooms/:roomId/boards",
  requireAuth,
  loadRoom,
  requireRoomEditor,
  validateRequest(createBoardSchema),
  createBoard,
);

router.get(
  "/rooms/:roomId/boards",
  requireAuth,
  loadRoom,
  requireRoomMember,
  getBoardsByRoom,
);

router.get(
  "/boards/:boardId",
  requireAuth,
  loadBoard,
  requireRoomMember,
  getBoardById,
);

router.patch(
  "/boards/:boardId",
  requireAuth,
  loadBoard,
  requireRoomEditor,
  validateRequest(updateBoardSchema),
  updateBoard,
);

router.delete(
  "/boards/:boardId",
  requireAuth,
  loadBoard,
  requireRoomOwner,
  deleteBoard,
);

/* -------------------------------------------------------------------------- */
/*                                    Pages                                   */
/* -------------------------------------------------------------------------- */

// router.post(
//   "/boards/:boardId/pages",
//   requireAuth,
//   loadBoard,
//   requireRoomEditor,
//   createPage,
// );

router.post(
  "/boards/:boardId/pages",
  requireAuth,
  loadBoard,
  requireRoomEditor,
  createPage,
);

router.get(
  "/boards/:boardId/pages",
  requireAuth,
  loadBoard,
  requireRoomMember,
  getPages,
);

router.get(
  "/pages/:pageId",
  requireAuth,
  loadPage,
  requireRoomMember,
  getPageById,
);

router.patch(
  "/pages/:pageId",
  requireAuth,
  loadPage,
  requireRoomEditor,
  validateRequest(updatePageSchema),
  updatePage,
);

router.delete(
  "/pages/:pageId",
  requireAuth,
  loadPage,
  requireRoomAdmin,
  deletePage,
);
export default router;
