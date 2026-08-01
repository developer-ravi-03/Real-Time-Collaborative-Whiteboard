import ApiResponse from "../../../utils/ApiResponse.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import RoomService from "../room.service.js";

/* -------------------------------------------------------------------------- */
/*                                 Load Room                                  */
/* -------------------------------------------------------------------------- */

export const loadRoom = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  const room = await RoomService.getRoom(roomId);

  if (!room) {
    return res.status(404).json(new ApiResponse(404, "Room not found.", null));
  }

  req.room = room;

  next();
});

/* -------------------------------------------------------------------------- */
/*                           Permission Factory                               */
/* -------------------------------------------------------------------------- */

const authorize = (allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    const membership = await RoomService.getMembership(
      req.room.id,
      req.user.id,
    );

    if (!membership) {
      return res
        .status(403)
        .json(new ApiResponse(403, "You are not a member of this room.", null));
    }

    if (!allowedRoles.includes(membership.role)) {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            "You don't have permission to perform this action.",
            null,
          ),
        );
    }

    req.membership = membership;

    next();
  });

export const requireRoomMember = authorize([
  "OWNER",
  "ADMIN",
  "EDITOR",
  "VIEWER",
]);

export const requireRoomEditor = authorize(["OWNER", "ADMIN", "EDITOR"]);

export const requireRoomAdmin = authorize(["OWNER", "ADMIN"]);

export const requireRoomOwner = authorize(["OWNER"]);
