import { Webhook } from "svix";

import env from "../../config/env.js";
import userService from "../user/user.service.js";

class AuthService {
  async handleWebhook(req) {
    const payload = req.body;

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    /* -------------------------------------------------------------------------- */
    /*                           Validate Svix Headers                            */
    /* -------------------------------------------------------------------------- */

    if (
      !headers["svix-id"] ||
      !headers["svix-timestamp"] ||
      !headers["svix-signature"]
    ) {
      throw new Error("Missing Svix headers.");
    }

    const webhook = new Webhook(env.CLERK_WEBHOOK_SECRET);

    let event;

    try {
      event = webhook.verify(payload, headers);
    } catch (error) {
      throw new Error("Invalid webhook signature.");
    }

    const { type, data } = event;

    switch (type) {
      case "user.created":
      case "user.updated":
        await this.syncUser(data);
        break;

      case "user.deleted":
        await this.deleteUser(data);
        break;

      default:
        console.log(`Unhandled Clerk Event: ${type}`);
    }
  }

  async syncUser(data) {
    const primaryEmail = data.email_addresses?.find(
      (email) => email.id === data.primary_email_address_id,
    );

    const userData = {
      clerkId: data.id,
      email: primaryEmail?.email_address ?? null,
      username: data.username ?? null,
      firstName: data.first_name ?? null,
      lastName: data.last_name ?? null,
      displayName:
        `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || null,
      imageUrl: data.image_url ?? null,
      isActive: true,
    };

    await userService.upsertUser(userData);
  }

  async deleteUser(data) {
    if (!data.id) return;

    const existingUser = await userService.getUserByClerkId(data.id);

    if (!existingUser) {
      console.log(`User not found for Clerk ID: ${data.id}`);
      return;
    }

    await userService.deleteUser(data.id);
  }
}

export default new AuthService();
