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
  const roomId = req.room.id;

  const member = await RoomMemberService.removeMember(
    roomId,
    req.params.memberId,
    req.user.id,
  );

  /*
   * REST mutation is complete.
   *
   * Now notify connected sockets that belong to the removed
   * user but are NOT currently inside the room.
   *
   * Room sockets are already handled by member.handler.js
   * through the existing member:remove realtime flow.
   */
  const io = req.app.get("io");

  if (io) {
    const sockets = await io.fetchSockets();

    for (const clientSocket of sockets) {
      const connectedUserId = clientSocket.user?.id;

      if (connectedUserId !== member.user.id) {
        continue;
      }

      /*
       * If the user is already inside the room, the existing
       * member socket handler will handle the kick.
       *
       * If the user is on the dashboard or another page,
       * notify that socket directly.
       */
      if (clientSocket.currentRoomId === roomId) {
        continue;
      }

      clientSocket.emit("member:removed", {
        roomId,

        memberId: member.id,

        userId: member.user.id,

        kicked: true,

        removedBy: {
          id: req.user.id,
          displayName: req.user.displayName ?? null,
        },
      });
    }
  }

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
