import { Controller, Post, Req, UseGuards } from "@nestjs/common";

import { CreateWalletUseCase } from "@/application/use-cases/wallets/create";

import {
  AuthGuard,
  type AuthenticatedRequest,
} from "@/presentation/guards/auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller()
@ApiTags("Wallets")
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class CreateWalletController {
  constructor(private readonly createWalletUseCase: CreateWalletUseCase) {}

  @Post("/")
  async handle(@Req() req: AuthenticatedRequest) {
    await this.createWalletUseCase.execute(req.user);
  }
}
