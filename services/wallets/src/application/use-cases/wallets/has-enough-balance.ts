import type { WalletsRepository } from "@/domain/repositories/wallets.repository";
import { walletsRepositoryToken } from "@/domain/repositories/wallets.repository";

import { Inject, Injectable } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";

type HasEnoughBalanceInput = {
  userId: string;
  intendedSpendInCents: number;
};

@Injectable()
export class HasEnoughBalanceUseCase {
  constructor(
    @Inject(walletsRepositoryToken)
    private readonly walletsRepository: WalletsRepository,
  ) {}

  async execute(input: HasEnoughBalanceInput) {
    const wallet = await this.walletsRepository.findByUserId(input.userId);
    if (!wallet) throw new NotFoundException("Wallet not found");

    return wallet.balance.cents >= input.intendedSpendInCents;
  }
}
