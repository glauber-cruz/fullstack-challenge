import { Controller, UsePipes } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { ZodValidationPipe } from "nestjs-zod";

import { ProcessBetUseCase } from "@/application/use-cases/bets/process";
import z from "zod";

const processBetSchema = z.object({
  betId: z.string(),
  isValid: z.boolean(),
});

type ProcessBetSchema = z.infer<typeof processBetSchema>;

@Controller()
export class ProcessBetConsumerService {
  constructor(private readonly processBetUseCase: ProcessBetUseCase) {}

  @UsePipes(new ZodValidationPipe(processBetSchema))
  @MessagePattern("process_bet")
  async handleProcessBet(@Payload() data: ProcessBetSchema) {
    await this.processBetUseCase.execute(data);
  }
}
