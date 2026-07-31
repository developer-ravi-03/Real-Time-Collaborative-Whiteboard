import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import UserService from "./user.service.js";

export const currentDatabaseUser = asyncHandler(async (req, res) => {
  const clerkId = req.auth.userId;

  const user = await UserService.getUserByClerkId(clerkId);

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, "User not found in database.", null));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Current database user fetched successfully.", user),
    );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const clerkId = req.auth.userId;

  const updatedUser = await UserService.updateProfile(clerkId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile updated successfully.", updatedUser));
});

export const searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.q?.trim();

  if (!query) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Search query is required.", null));
  }

  const users = await UserService.searchUsers(query);

  return res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully.", users));
});
