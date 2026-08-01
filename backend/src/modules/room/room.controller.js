import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import RoomService from "./room.service.js";
import UserService from "../user/user.service.js";
import { roomDetailsPresenter } from "./presenters/room.presenter.js";

export const createRoom = asyncHandler(async (req, res) => {
  const room = await RoomService.createRoom(req.user.id, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Room created successfully.", room));
});

export const getMyRooms = asyncHandler(async (req, res) => {
  const user = await UserService.getUserByClerkId(req.auth.userId);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, "User not found.", null));
  }

  const rooms = await RoomService.getMyRooms(user.id);

  const formattedRooms = rooms.map((room) => ({
    id: room.id,
    name: room.name,
    slug: room.slug,
    roomCode: room.roomCode,

    description: room.description,
    thumbnail: room.thumbnail,
    visibility: room.visibility,

    owner: room.owner,

    yourRole: room.memberships[0]?.role,

    memberCount: room._count.memberships,

    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, "Rooms fetched successfully.", formattedRooms));
});

export const getRoomById = asyncHandler(async (req, res) => {
  const room = await RoomService.getRoomDetails(req.room.id);

  const response = roomDetailsPresenter(room, req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Room fetched successfully.", response));
});
