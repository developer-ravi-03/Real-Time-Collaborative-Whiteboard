import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                               Create Page                                  */
/* -------------------------------------------------------------------------- */

export const createPageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Page name is required.")
    .max(100, "Page name cannot exceed 100 characters."),
});

/* -------------------------------------------------------------------------- */
/*                               Update Page                                  */
/* -------------------------------------------------------------------------- */

export const updatePageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Page name is required.")
    .max(100, "Page name cannot exceed 100 characters.")
    .optional()
    .nullable(),
});

/* -------------------------------------------------------------------------- */
/*                              Save Canvas                                   */
/* -------------------------------------------------------------------------- */

export const saveCanvasSchema = z.object({
  canvasData: z.object({}).passthrough(),
});
