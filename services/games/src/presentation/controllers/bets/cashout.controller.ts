import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { AuthGuard } from "@/presentation/guards/auth.guard";

import { CashoutBetUseCase } from "@/application/use-cases/bets/cashout";
import z from "zod";

import { createZodDto, ZodValidationPipe } from "nestjs-zod";

export const cashoutBetSchema = z.object({
  betId: z.string(),
});

class CashoutBetBody extends createZodDto(cashoutBetSchema) {}

@Controller("bets")
@ApiTags("Bets")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BetsCashoutController {
  constructor(private readonly cashoutBetUseCase: CashoutBetUseCase) {}
  @Post("cashout")
  @UsePipes(new ZodValidationPipe(cashoutBetSchema))
  async handle(@Body() body: CashoutBetBody) {
    await this.cashoutBetUseCase.execute({
      betId: body.betId,
    });
  }
}
