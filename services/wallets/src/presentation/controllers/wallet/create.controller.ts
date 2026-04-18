import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";

import { createZodDto } from "nestjs-zod";
import { CreateWalletUseCase } from "@/application/use-cases/wallet/create";

export const createCommandSchema = z.object({
  userId: z.string(),
});

class CreateWalletBody extends createZodDto(createCommandSchema) {}

@Controller()
export class CreateWalletController {
  constructor(private readonly createWalletUseCase: CreateWalletUseCase) {}

  @Post("/")
  async handle(@Body() body: CreateWalletBody) {
    await this.createWalletUseCase.execute(body.userId);
  }
}
