import { Controller, UsePipes } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { ZodValidationPipe } from "nestjs-zod";

import { AddGainUseCase } from "@/application/use-cases/wallets/add-gain";
import z from "zod";

const addGainSchema = z.object({
  userId: z.string(),
  gainInCents: z.int().min(100).max(100_000),
});

type AddGainSchema = z.infer<typeof addGainSchema>;

@Controller()
export class AddGainConsumerService {
  constructor(private readonly addGainUseCase: AddGainUseCase) {}

  @UsePipes(new ZodValidationPipe(addGainSchema))
  @EventPattern("add_gain")
  async handleAddGain(@Payload() data: AddGainSchema) {
    await this.addGainUseCase.execute(data);
  }
}
