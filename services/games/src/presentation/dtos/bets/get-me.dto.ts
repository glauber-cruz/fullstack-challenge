import { createZodDto } from "nestjs-zod";
import z from "zod";
import { CursorPaginationSchema } from "../../schemas/cursor-pagination.schema";

export type GetBetsMeResponse = {
  items: {
    id: string;
    roundId: string;
    amount: number;
    cashoutMultiplier: number | null;
    cashedOutAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  nextCursor?: string;
  limit: number;
};

export const GetBetsMeSchema = z
  .object({
    items: z.array(
      z.object({
        id: z.string(),
        roundId: z.string(),
        amount: z.number(),
        cashoutMultiplier: z.number().nullable(),
        cashedOutAt: z
          .string()
          .nullable()
          .transform((s) => {
            if (s === null) return null;
            return new Date(s);
          }),
        createdAt: z.string().transform((s) => new Date(s)),
        updatedAt: z.string().transform((s) => new Date(s)),
      }),
    ),
  })
  .extend(CursorPaginationSchema.shape);

export class GetBetsMeResponseDto extends createZodDto(GetBetsMeSchema) {}

export class GetBetsMePresentation {
  static toHTTP(bets: GetBetsMeResponse) {
    return GetBetsMeSchema.parse(bets);
  }
}
