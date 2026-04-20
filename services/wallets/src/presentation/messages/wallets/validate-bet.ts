import { Controller, UsePipes } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { ZodValidationPipe } from "nestjs-zod";

import { HasEnoughBalanceUseCase } from "@/application/use-cases/wallets/has-enough-balance";
import z from "zod";

const validateBetSchema = z.object({
  userId: z.string(),
  intendedSpendInCents: z.int().min(100).max(100_000),
  betId: z.string(),
});

type ValidateBetSchema = z.infer<typeof validateBetSchema>;

@Controller()
export class ValidateBetConsumerService {
  constructor(
    private readonly hasEnoughBalanceUseCase: HasEnoughBalanceUseCase,
  ) {}

  @UsePipes(new ZodValidationPipe(validateBetSchema))
  @EventPattern("validate_bet_intent")
  async handleValidateBet(@Payload() data: ValidateBetSchema) {
    await this.hasEnoughBalanceUseCase.execute(data);
  }
}
