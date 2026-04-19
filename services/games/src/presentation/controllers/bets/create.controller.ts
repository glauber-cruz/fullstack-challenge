import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { AuthGuard } from "@/presentation/guards/auth.guard";
import type { AuthenticatedRequest } from "@/presentation/guards/auth.guard";

@Controller("bets")
@ApiTags("Bets")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BetsCreateController {
  @Post()
  async handle(
    @Req() req: AuthenticatedRequest,
    @Body() body: { roundId: string; amount: number },
  ) {
    return {
      message: "TODO: implementar use case de criação de aposta",
      userId: req.user.sub,
      roundId: body.roundId,
      amount: body.amount,
    };
  }
}
