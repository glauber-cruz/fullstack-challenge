import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { AuthGuard } from "@/presentation/guards/auth.guard";
import type { AuthenticatedRequest } from "@/presentation/guards/auth.guard";
import { GetBetsMeQueryHandler } from "@/infrastructure/query-handler/bets/get-me";
import {
  type GetBetsMeHttpResponse,
  GetBetsMePresentation,
  GetBetsMeQueryDto,
  GetBetsMeQuerySchema,
  GetBetsMeResponseDto,
} from "@/presentation/dtos/bets/get-me.dto";
import { ZodValidationPipe } from "@/presentation/pipes/zod-validation.pipe";

@Controller("bets")
@ApiTags("Bets")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BetsGetMeController {
  constructor(private readonly getBetsMeQueryHandler: GetBetsMeQueryHandler) {}

  @Get("me")
  @ApiOperation({ summary: "Apostas do usuário (cursor)" })
  @ApiOkResponse({ type: GetBetsMeResponseDto })
  @UsePipes(new ZodValidationPipe(GetBetsMeQuerySchema))
  async handle(
    @Req() req: AuthenticatedRequest,
    @Query() query: GetBetsMeQueryDto,
  ): Promise<GetBetsMeHttpResponse> {
    const result = await this.getBetsMeQueryHandler.execute({
      userId: req.user.sub,
      nextCursor: query.nextCursor,
      limit: query.limit,
    });
    return GetBetsMePresentation.toHTTP(result);
  }
}
