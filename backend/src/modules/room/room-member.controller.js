import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import RoomMemberService from "./room-member.service.js";
import {
  joinedRoomPresenter,
  removedMemberPresenter,
  roomMembersPresenter,
  updatedMemberPresenter,
} from "./presenters/room.presenter.js";

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

/* -------------------------------------------------------------------------- */
/*                              Get Members                                   */
/* -------------------------------------------------------------------------- */

export const getRoomMembers = asyncHandler(async (req, res) => {
  const members = await RoomMemberService.getRoomMembers(req.room.id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Room members fetched successfully.",
        roomMembersPresenter(members),
      ),
    );
});

/* -------------------------------------------------------------------------- */
/*                           Update Member Role                               */
/* -------------------------------------------------------------------------- */

export const updateMemberRole = asyncHandler(async (req, res) => {
  const member = await RoomMemberService.updateMemberRole(
    req.room.id,
    req.params.memberId,
    req.user.id,
    req.body.role,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Member role updated successfully.",
        updatedMemberPresenter(member),
      ),
    );
});

export const removeMember = asyncHandler(async (req, res) => {
  const member = await RoomMemberService.removeMember(
    req.room.id,
    req.params.memberId,
    req.user.id,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Member removed successfully.",
        removedMemberPresenter(member),
      ),
    );
});

/* -------------------------------------------------------------------------- */
/*                               Leave Room                                   */
/* -------------------------------------------------------------------------- */

export const leaveRoom = asyncHandler(async (req, res) => {
  const member = await RoomMemberService.leaveRoom(req.room.id, req.user.id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "You left the room successfully.",
        removedMemberPresenter(member),
      ),
    );
});
