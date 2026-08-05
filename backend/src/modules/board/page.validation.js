import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                               Create Page                                  */
/* -------------------------------------------------------------------------- */
export const createPageSchema = z.object({});
/* -------------------------------------------------------------------------- */
/*                               Update Page                                  */
/* -------------------------------------------------------------------------- */

export const updatePageSchema = z.object({
  title: z.string().trim().max(100).optional().nullable(),

  canvasData: z.object({}).passthrough().optional(),
});
