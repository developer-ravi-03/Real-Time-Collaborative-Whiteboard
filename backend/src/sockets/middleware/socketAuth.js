import { verifyToken } from "@clerk/backend";

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

      if (!devUser.isActive) {
        return next(new Error("User account is inactive."));
      }

      socket.user = devUser;

      socket.auth = {
        userId: devUser.clerkId,
        development: true,
      };

      return next();
    }

    /* -------------------------------------------------------------------------- */
    /*                              Clerk Auth Mode                               */
    /* -------------------------------------------------------------------------- */

    const token = socket.handshake.auth?.token;

    if (!token || typeof token !== "string") {
      return next(new Error("Authentication token is required."));
    }

    if (!env.CLERK_SECRET_KEY) {
      return next(new Error("Clerk secret key is not configured."));
    }

    const verifiedToken = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
      authorizedParties: [env.FRONTEND_URL],
    });

    const clerkId = verifiedToken?.sub;

    if (!clerkId) {
      return next(new Error("Invalid authentication token."));
    }

    const user = await UserService.getUserByClerkId(clerkId);

    if (!user) {
      return next(new Error("User account not found."));
    }

    if (!user.isActive) {
      return next(new Error("User account is inactive."));
    }

    /* -------------------------------------------------------------------------- */
    /*                         Attach Authenticated Context                        */
    /* -------------------------------------------------------------------------- */

    socket.user = user;

    socket.auth = {
      userId: user.clerkId,
      clerkId,
      sessionId: verifiedToken.sid ?? null,
      development: false,
    };

    return next();
  } catch (error) {
    console.error("Socket authentication failed:", error);

    return next(new Error("Socket authentication failed."));
  }
}
