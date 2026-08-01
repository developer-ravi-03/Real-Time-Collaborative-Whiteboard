import { getAuth } from "../../config/clerk.js";
import env from "../../config/env.js";

import ApiResponse from "../../utils/ApiResponse.js";

import UserService from "../user/user.service.js";

export const requireAuth = async (req, res, next) => {
  try {
    /* -------------------------------------------------------------------------- */
    /*                           Development Auth Mode                            */
    /* -------------------------------------------------------------------------- */

    if (env.AUTH_MODE === "development") {
      const devUser = await UserService.getUserByEmail(env.DEV_USER_EMAIL);

      if (!devUser) {
        return res
          .status(404)
          .json(
            new ApiResponse(
              404,
              "Development user not found. Please create a Clerk account first.",
              null,
            ),
          );
      }

      req.user = devUser;

      req.auth = {
        userId: devUser.clerkId,
        development: true,
      };

      return next();
    }

    /* -------------------------------------------------------------------------- */
    /*                               Clerk Auth                                   */
    /* -------------------------------------------------------------------------- */

    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json(new ApiResponse(401, "Unauthorized.", null));
    }

    const user = await UserService.getUserByClerkId(auth.userId);

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, "User not found.", null));
    }

    req.auth = auth;
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
