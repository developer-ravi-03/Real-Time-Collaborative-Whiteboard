import asyncHandler from "../../../utils/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import db from "../../../lib/db.js";

export const loadPage = asyncHandler(async (req, res, next) => {
  const { pageId } = req.params;

  const page = await db.boardPage.findUnique({
    where: {
      id: pageId,
    },

    include: {
      board: {
        include: {
          room: true,
        },
      },
    },
  });

  if (!page) {
    throw new ApiError(404, "Page not found.");
  }

  req.page = page;

  req.board = page.board;

  req.room = page.board.room;

  next();
});
