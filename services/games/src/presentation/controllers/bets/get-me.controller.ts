import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { AuthGuard } from "@/presentation/guards/auth.guard";
import type { AuthenticatedRequest } from "@/presentation/guards/auth.guard";
import { GetBetsMeQueryHandler } from "@/infrastructure/query-handler/bets/get-me";
import {
  GetBetsMePresentation,
  GetBetsMeResponseDto,
} from "@/presentation/dtos/bets/get-me.dto";
import { GetBetsMeSchema } from "@/presentation/dtos/bets/get-me.dto";
import { ZodValidationPipe } from "@/presentation/pipes/zod-validation.pipe";
import { createZodDto } from "nestjs-zod";
import z from "zod";

export const getBetsMeSchema = z.object({
  nextCursor: z.string().optional(),
  limit: z.number().int().min(1).max(100),
});

class GetBetsMeQuery extends createZodDto(getBetsMeSchema) {}

@Controller("bets")
@ApiTags("Bets")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BetsGetMeController {
  constructor(private readonly getBetsMeQueryHandler: GetBetsMeQueryHandler) {}

  @Get("me")
  @ApiOkResponse({ type: GetBetsMeResponseDto })
  @UsePipes(new ZodValidationPipe(GetBetsMeSchema))
  async handle(
    @Req() req: AuthenticatedRequest,
    @Query() query: GetBetsMeQuery,
  ) {
    const result = await this.getBetsMeQueryHandler.execute({
      userId: req.user.sub,
      nextCursor: query.nextCursor,
      limit: query.limit,
    });

    return GetBetsMePresentation.toHTTP(result);
  }
}
