import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { AuthGuard } from "@/presentation/guards/auth.guard";
import type { AuthenticatedRequest } from "@/presentation/guards/auth.guard";

@Controller("bets")
@ApiTags("Bets")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BetsCashoutController {
  @Post("cashout")
  async handle(
    @Req() req: AuthenticatedRequest,
    @Body() body: { roundId: string; cashoutMultiplier: number },
  ) {
    return {
      message: "TODO: implementar use case de cashout",
      userId: req.user.sub,
      roundId: body.roundId,
      cashoutMultiplier: body.cashoutMultiplier,
    };
  }
}
