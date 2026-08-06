import env from "../../config/env.js";

import UserService from "../../modules/user/user.service.js";

export default async function socketAuth(socket, next) {
  try {
    /* -------------------------------------------------------------------------- */
    /*                           Development Auth Mode                            */
    /* -------------------------------------------------------------------------- */

    if (env.AUTH_MODE === "development") {
      const devUser = await UserService.getUserByEmail(env.DEV_USER_EMAIL);

      if (!devUser) {
        return next(new Error("Development user not found."));
      }

      socket.user = devUser;

      socket.auth = {
        userId: devUser.clerkId,
        development: true,
      };

      return next();
    }

    /* -------------------------------------------------------------------------- */
    /*                           Production (Coming Next)                         */
    /* -------------------------------------------------------------------------- */

    return next(new Error("Production socket auth not implemented yet."));
  } catch (error) {
    next(error);
  }
}
