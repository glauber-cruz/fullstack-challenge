import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { AuthGuard } from "@/presentation/guards/auth.guard";
import type { AuthenticatedRequest } from "@/presentation/guards/auth.guard";

import { z } from "zod";
import { CreateBetUseCase } from "@/application/use-cases/bets/create";

import { createZodDto, ZodValidationPipe } from "nestjs-zod";
import {
  CreateBetPresentation,
  CreateBetResponseDto,
} from "@/presentation/dtos/bets/create.dto";

export const createBetSchema = z.object({
  roundId: z.uuid(),
  amountInCents: z.int().min(100).max(100_000),
});

class CreateBetBody extends createZodDto(createBetSchema) {}

@Controller("bets")
@ApiTags("Bets")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BetsCreateController {
  constructor(private readonly createBetUseCase: CreateBetUseCase) {}

  @Post()
  @ApiOkResponse({ type: CreateBetResponseDto })
  @UsePipes(new ZodValidationPipe(createBetSchema))
  async handle(@Req() req: AuthenticatedRequest, @Body() body: CreateBetBody) {
    const betId = await this.createBetUseCase.execute({
      user: req.user,
      roundId: body.roundId,
      amountInCents: body.amountInCents,
    });
    return CreateBetPresentation.toHTTP({ id: betId });
  }
}
