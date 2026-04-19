import { createZodDto } from "nestjs-zod";
import z from "zod";
import { CursorPaginationSchema } from "../../schemas/cursor-pagination.schema";
import { RoundStatus } from "@/domain/enums/rounds";

export type FetchRoundsHistoryResponse = {
  items: {
    id: string;
    status: RoundStatus;
    startAt?: Date;
    endedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }[];
  nextCursor?: string;
  limit: number;
};

export const FetchRoundsHistoryResponseSchema = z
  .object({
    items: z.array(
      z.object({
        id: z.string(),
        status: z.enum(RoundStatus),
        startAt: z
          .string()
          .nullable()
          .transform((s) => (s ? new Date(s) : null)),
        endedAt: z
          .string()
          .nullable()
          .transform((s) => (s ? new Date(s) : null)),
        createdAt: z.string().transform((s) => new Date(s)),
        updatedAt: z.string().transform((s) => new Date(s)),
      }),
    ),
  })
  .extend(CursorPaginationSchema.shape);

export class FetchRoundsHistoryResponseDto extends createZodDto(
  FetchRoundsHistoryResponseSchema,
) {}

export class FetchRoundsHistoryPresentation {
  static toHTTP(bets: FetchRoundsHistoryResponse) {
    return FetchRoundsHistoryResponseSchema.parse(bets);
  }
}
