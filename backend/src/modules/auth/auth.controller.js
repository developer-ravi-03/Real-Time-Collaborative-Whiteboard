import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AuthService from "./auth.service.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Authenticated user fetched successfully.",
        req.user,
      ),
    );
});

export const clerkWebhook = asyncHandler(async (req, res) => {
  await AuthService.handleWebhook(req);

  return res.status(200).json({
    success: true,
  });
});
