import { Wallet } from "@/domain/entites/wallets.entity";

import type { WalletsRepository } from "@/domain/repositories/wallets.repository";
import { walletsRepositoryToken } from "@/domain/repositories/wallets.repository";

import { ConflictException, Inject } from "@nestjs/common";

export class CreateWalletUseCase {
  constructor(
    @Inject(walletsRepositoryToken)
    private readonly walletsRepository: WalletsRepository,
  ) {}

  async execute(userId: string) {
    const userHasWallet = await this.walletsRepository.userHasWallet(userId);
    if (userHasWallet) throw new ConflictException("User already has a wallet");

    const wallet = Wallet.create({ userId });
    await this.walletsRepository.create(wallet);
  }
}
