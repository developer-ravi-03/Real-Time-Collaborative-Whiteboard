import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(3, "Display name must be at least 3 characters.")
    .max(50, "Display name cannot exceed 50 characters.")
    .optional(),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username cannot exceed 30 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can contain only letters, numbers and underscores.",
    )
    .optional(),
});

export const searchUsersSchema = z.object({
  q: z
    .string()
    .trim()
    .min(2, "Search query must be at least 2 characters.")
    .max(50, "Search query cannot exceed 50 characters."),
});
