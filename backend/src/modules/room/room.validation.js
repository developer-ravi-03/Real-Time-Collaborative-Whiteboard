import { z } from "zod";

export const createRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Room name must be at least 3 characters.")
    .max(100, "Room name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),

  visibility: z.enum(["PRIVATE", "PUBLIC"]).default("PRIVATE"),
});

export const updateRoomSchema = z.object({
  name: z.string().trim().min(3).max(60).optional(),

  description: z.string().trim().max(500).optional(),

  visibility: z.enum(["PRIVATE", "PUBLIC"]).optional(),

  thumbnail: z.string().url().optional(),
});
