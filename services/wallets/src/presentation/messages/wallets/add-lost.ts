import { Controller, UsePipes } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { ZodValidationPipe } from "nestjs-zod";

import { AddLostUseCase } from "@/application/use-cases/wallets/add-lost";
import z from "zod";

const addLostSchema = z.object({
  losts: z.array(
    z.object({
      userId: z.string(),
      lostInCents: z.int().min(100).max(100_000),
    }),
  ),
});

type AddLostSchema = z.infer<typeof addLostSchema>;

@Controller()
export class AddLostConsumerService {
  constructor(private readonly addLostUseCase: AddLostUseCase) {}

  @UsePipes(new ZodValidationPipe(addLostSchema))
  @EventPattern("add_lost")
  async handleAddLost(@Payload() data: AddLostSchema) {
    await this.addLostUseCase.execute(data);
  }
}
