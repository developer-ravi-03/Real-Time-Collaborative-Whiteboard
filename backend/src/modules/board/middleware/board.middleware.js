import ApiResponse from "../../../utils/ApiResponse.js";
import asyncHandler from "../../../utils/asyncHandler.js";

import BoardService from "../board.service.js";

export const loadBoard = asyncHandler(async (req, res, next) => {
  const { boardId } = req.params;

  const board = await BoardService.getBoard(boardId);

  if (!board) {
    return res.status(404).json(new ApiResponse(404, "Board not found.", null));
  }

  req.board = board;
  req.room = board.room;

  next();
});
