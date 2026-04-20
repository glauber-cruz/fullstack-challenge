import { Controller, UsePipes } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { ZodValidationPipe } from "nestjs-zod";

import { HasEnoughBalanceUseCase } from "@/application/use-cases/wallets/has-enough-balance";
import z from "zod";

const validateBetSchema = z.object({
  userId: z.string(),
  intendedSpendInCents: z.int().min(100).max(100_000),
});

type ValidateBetSchema = z.infer<typeof validateBetSchema>;

@Controller()
export class ValidateBetConsumerService {
  constructor(
    private readonly hasEnoughBalanceUseCase: HasEnoughBalanceUseCase,
  ) {}

  @UsePipes(new ZodValidationPipe(validateBetSchema))
  @MessagePattern("validate_bet")
  async handleValidateBet(@Payload() data: ValidateBetSchema) {
    return await this.hasEnoughBalanceUseCase.execute(data);
  }
}
