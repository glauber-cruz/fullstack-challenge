import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { AuthGuard } from "@/presentation/guards/auth.guard";
import type { AuthenticatedRequest } from "@/presentation/guards/auth.guard";

import { z } from "zod";
import { CreateBetUseCase } from "@/application/use-cases/bets/create";

import { createZodDto } from "nestjs-zod";

export const createBetSchema = z.object({
  roundId: z.string(),
  amount: z.number(),
});

class CreateBetBody extends createZodDto(
  createBetSchema,
) {}

@Controller("bets")
@ApiTags("Bets")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BetsCreateController {
  constructor(private readonly createBetUseCase: CreateBetUseCase) {}

  @Post()
  async handle(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateBetBody,
  ) {
    await this.createBetUseCase.execute({
      user: req.user,
      roundId: body.roundId,
      amount: body.amount,
    });
  }
}
