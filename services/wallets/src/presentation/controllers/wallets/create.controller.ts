import { Controller, Post, Req, UseGuards } from "@nestjs/common";

import { CreateWalletUseCase } from "@/application/use-cases/wallets/create";

import { AuthGuard, type AuthenticatedRequest } from "@/presentation/guards/auth.guard";

@Controller()
@UseGuards(AuthGuard)
export class CreateWalletController {
  constructor(private readonly createWalletUseCase: CreateWalletUseCase) {}

  @Post("/")
  async handle(@Req() req: AuthenticatedRequest) {
    await this.createWalletUseCase.execute(req.user.sub);
  }
}
