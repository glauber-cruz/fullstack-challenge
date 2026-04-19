import { Controller, Get, Query } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { FetchRoundsHistoryQueryHandler } from "@/infrastructure/query-handler/rounds/fetch-history";
import z from "zod";
import { createZodDto } from "nestjs-zod";
import { FetchRoundsHistoryResponseDto } from "@/presentation/dtos/rounds/fetch-history";

export const fetchRoundsHistorySchema = z.object({
  nextCursor: z.string().optional(),
  limit: z.number().int().min(1).max(100),
});

class FetchRoundsHistoryQuery extends createZodDto(fetchRoundsHistorySchema) {}

@Controller()
@ApiTags("Rounds")
export class RoundsFetchHistoryController {
  constructor(
    private readonly fetchRoundsHistoryQueryHandler: FetchRoundsHistoryQueryHandler,
  ) {}

  @Get("/rounds/history")
  @ApiOkResponse({ type: FetchRoundsHistoryResponseDto })
  async handle(@Query() query: FetchRoundsHistoryQuery) {
    return this.fetchRoundsHistoryQueryHandler.execute({
      nextCursor: query.nextCursor,
      limit: query.limit,
    });
  }
}
