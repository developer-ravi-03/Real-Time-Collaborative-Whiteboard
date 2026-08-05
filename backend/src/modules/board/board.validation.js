import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                               Board Type Enum                              */
/* -------------------------------------------------------------------------- */

const BoardTypeEnum = z.enum(["INFINITE", "SLIDES"]);

/* -------------------------------------------------------------------------- */
/*                              Create Board                                  */
/* -------------------------------------------------------------------------- */

export const createBoardSchema = z.object({
  name: z.string().trim().min(3).max(100),

  description: z.string().trim().max(500).optional().nullable(),

  type: BoardTypeEnum,
});

/* -------------------------------------------------------------------------- */
/*                              Update Board                                  */
/* -------------------------------------------------------------------------- */

export const updateBoardSchema = z.object({
  name: z.string().trim().min(3).max(100).optional(),

  description: z.string().trim().max(500).optional().nullable(),
});
