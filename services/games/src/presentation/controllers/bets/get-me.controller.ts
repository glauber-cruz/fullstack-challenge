import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { AuthGuard } from "@/presentation/guards/auth.guard";
import type { AuthenticatedRequest } from "@/presentation/guards/auth.guard";

@Controller("bets")
@ApiTags("Bets")
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class BetsGetMeController {
  @Get("me")
  async handle(@Req() req: AuthenticatedRequest) {
    return {
      message: "TODO: implementar listagem de apostas do usuário",
      userId: req.user.sub,
    };
  }
}
