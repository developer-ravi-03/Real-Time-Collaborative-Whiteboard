import ApiResponse from "../../utils/ApiResponse.js";
import { getAuth } from "../../config/clerk.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AuthService from "./auth.service.js";

export const getCurrentUser = async (req, res) => {
  const auth = getAuth(req);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Authenticated user fetched successfully.", auth),
    );
};

export const clerkWebhook = asyncHandler(async (req, res) => {
  await AuthService.handleWebhook(req);

  return res.status(200).json({
    success: true,
  });
});
