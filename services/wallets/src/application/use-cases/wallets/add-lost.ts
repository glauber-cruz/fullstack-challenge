import type { WalletsRepository } from "@/domain/repositories/wallets.repository";
import { walletsRepositoryToken } from "@/domain/repositories/wallets.repository";

import { Inject, Injectable } from "@nestjs/common";

type AddLostInput = {
  losts: {
    userId: string;
    lostInCents: number;
  }[];
};

@Injectable()
export class AddLostUseCase {
  constructor(
    @Inject(walletsRepositoryToken)
    private readonly walletsRepository: WalletsRepository,
  ) {}

  async execute(input: AddLostInput) {
    const wallets = await this.walletsRepository.findByIds(
      input.losts.map((lost) => lost.userId),
    );

    const lostsMapper = new Map<string, number>(
      input.losts.map((lost) => [lost.userId, lost.lostInCents]),
    );

    wallets.forEach((wallet) => {
      const lost = lostsMapper.get(wallet.userId);
      if (lost === undefined) return;
      wallet.lose(lost);
    });

    await this.walletsRepository.updateMany(wallets);
  }
}
