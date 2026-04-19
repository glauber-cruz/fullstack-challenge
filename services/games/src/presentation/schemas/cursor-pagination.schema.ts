import { z } from "zod";

export const CursorPaginationSchema = z.object({
  nextCursor: z.string().nullable(),
  limit: z.number(),
});