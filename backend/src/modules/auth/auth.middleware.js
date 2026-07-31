import { getAuth } from "../../config/clerk.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const requireAuth = (req, res, next) => {
  const auth = getAuth(req);

  if (!auth.userId) {
    return res
      .status(401)
      .json(new ApiResponse(401, "Unauthorized. Please sign in.", null));
  }

  req.auth = auth;

  next();
};
