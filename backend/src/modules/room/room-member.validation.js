import { z } from "zod";

export const joinRoomSchema = z.object({
  roomCode: z
    .string()
    .trim()
    .min(6, "Room code must be 6 characters.")
    .max(6, "Room code must be 6 characters.")
    .transform((value) => value.toUpperCase()),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
});
