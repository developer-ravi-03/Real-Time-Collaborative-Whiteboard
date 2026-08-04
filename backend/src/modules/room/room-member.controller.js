import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

import RoomMemberService from "./room-member.service.js";

import { joinedRoomPresenter } from "./presenters/room.presenter.js";

/* -------------------------------------------------------------------------- */
/*                                 Join Room                                  */
/* -------------------------------------------------------------------------- */

export const joinRoom = asyncHandler(async (req, res) => {
  const result = await RoomMemberService.joinRoom(
    req.body.roomCode,
    req.user.id,
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "Joined room successfully.",
        joinedRoomPresenter(result.room, result.role),
      ),
    );
});
