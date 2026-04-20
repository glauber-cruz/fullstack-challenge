import type { WalletsRepository } from "@/domain/repositories/wallets.repository";
import { walletsRepositoryToken } from "@/domain/repositories/wallets.repository";

import { Inject, Injectable } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";

import { ClientProxy } from "@nestjs/microservices";

type HasEnoughBalanceInput = {
  userId: string;
  intendedSpendInCents: number;
  betId: string;
};

@Injectable()
export class HasEnoughBalanceUseCase {
  constructor(
    @Inject(walletsRepositoryToken)
    private readonly walletsRepository: WalletsRepository,
    @Inject("GAMES_RMQ_CLIENT")
    private readonly gamesClient: ClientProxy,
  ) {}

  async execute(input: HasEnoughBalanceInput) {
    const wallet = await this.walletsRepository.findByUserId(input.userId);
    if (!wallet) throw new NotFoundException("Wallet not found");

    const isValid = wallet.balance.cents >= input.intendedSpendInCents;

    this.gamesClient.emit("process_bet", {
      betId: input.betId,
      isValid,
    });
  }
}
