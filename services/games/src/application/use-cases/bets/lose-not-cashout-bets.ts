import type { BetsRepository } from "@/domain/repositories/bets.repository";
import { betsRepositoryToken } from "@/domain/repositories/bets.repository";

import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class LoseNotCashoutBetsUseCase {
  constructor(
    @Inject(betsRepositoryToken)
    private readonly betsRepository: BetsRepository,
    @Inject("WALLETS_RMQ_CLIENT")
    private readonly walletsClient: ClientProxy,
  ) {}

  async execute(roundId: string) {
    const perPage = 100;
    let page = 1;

    let bets = await this.betsRepository.findNotCashoutByRoundId(
      roundId,
      perPage,
      page,
    );

    while (true) {
      if (bets.length === 0) break;
      bets.forEach((bet) => bet.lose());

      await this.betsRepository.updateMany(bets);
      page += 1;

      const losts = bets.map((bet) => {
        return {
          userId: bet.userId,
          lostInCents: bet.amount.cents,
        };
      });

      this.walletsClient.emit("add_lost", {
        losts,
      });

      bets = await this.betsRepository.findNotCashoutByRoundId(
        roundId,
        perPage,
        page,
      );
    }
  }
}
