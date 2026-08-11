import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                               Create Page                                  */
/* -------------------------------------------------------------------------- */

export const createPageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Page title is required.")
    .max(100, "Page title cannot exceed 100 characters."),
});
/* -------------------------------------------------------------------------- */
/*                               Update Page                                  */
/* -------------------------------------------------------------------------- */

export const updatePageSchema = z.object({
  title: z.string().trim().max(100).optional().nullable(),

  canvasData: z.object({}).passthrough().optional(),
});
