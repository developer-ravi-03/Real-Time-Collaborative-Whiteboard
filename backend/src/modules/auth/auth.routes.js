import { Router } from "express";

import { getCurrentUser, clerkWebhook } from "./auth.controller.js";

import { requireAuth } from "./auth.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Clerk Webhook
|--------------------------------------------------------------------------
*/

router.post("/webhook", clerkWebhook);

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

router.get("/me", requireAuth, getCurrentUser);

export default router;
