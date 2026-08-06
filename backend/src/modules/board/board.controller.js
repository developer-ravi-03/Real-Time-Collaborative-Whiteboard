import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

import BoardService from "./board.service.js";

import {
  boardDetailsPresenter,
  boardListPresenter,
  boardInitializationPresenter,
} from "./presenters/board.presenter.js";

/* -------------------------------------------------------------------------- */
/*                              Create Board                                  */
/* -------------------------------------------------------------------------- */

export const createBoard = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const board = await BoardService.createBoard(roomId, req.user.id, req.body);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "Board created successfully.",
        boardDetailsPresenter(board),
      ),
    );
});

/* -------------------------------------------------------------------------- */
/*                           Get Room Boards                                  */
/* -------------------------------------------------------------------------- */

export const getBoardsByRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const boards = await BoardService.getBoardsByRoom(roomId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Boards fetched successfully.",
        boardListPresenter(boards),
      ),
    );
});

/* -------------------------------------------------------------------------- */
/*                           Get Board By Id                                  */
/* -------------------------------------------------------------------------- */

export const getBoardById = asyncHandler(async (req, res) => {
  // const { boardId } = req.params;

  // const board = await BoardService.getBoardById(boardId);
  const board = await BoardService.getBoardDetails(req.board.id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Board fetched successfully.",
        boardDetailsPresenter(board),
      ),
    );
});

/* -------------------------------------------------------------------------- */
/*                        Board Initialization                                */
/* -------------------------------------------------------------------------- */

export const getBoardInitialization = asyncHandler(async (req, res) => {
  const board = await BoardService.getBoardInitialization(req.board.id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Board initialized successfully.",
        boardInitializationPresenter(board),
      ),
    );
});

/* -------------------------------------------------------------------------- */
/*                              Update Board                                  */
/* -------------------------------------------------------------------------- */

export const updateBoard = asyncHandler(async (req, res) => {
  // const { boardId } = req.params;

  // const board = await BoardService.updateBoard(boardId, req.body);
  const board = await BoardService.updateBoard(req.board.id, req.body);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Board updated successfully.",
        boardDetailsPresenter(board),
      ),
    );
});

/* -------------------------------------------------------------------------- */
/*                              Delete Board                                  */
/* -------------------------------------------------------------------------- */

export const deleteBoard = asyncHandler(async (req, res) => {
  await BoardService.deleteBoard(req.board.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Board deleted successfully.", null));
});
