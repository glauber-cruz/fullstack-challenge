import type { WalletsRepository } from "@/domain/repositories/wallets.repository";
import { walletsRepositoryToken } from "@/domain/repositories/wallets.repository";

import { Inject, Injectable, NotFoundException } from "@nestjs/common";

type AddGainInput = {
  userId: string;
  gainInCents: number;
};

@Injectable()
export class AddGainUseCase {
  constructor(
    @Inject(walletsRepositoryToken)
    private readonly walletsRepository: WalletsRepository,
  ) {}

  async execute(input: AddGainInput) {
    const wallet = await this.walletsRepository.findByUserId(input.userId);
    if (!wallet) throw new NotFoundException("Wallet not found");

    wallet.gain(input.gainInCents);
    await this.walletsRepository.update(wallet);
  }
}
