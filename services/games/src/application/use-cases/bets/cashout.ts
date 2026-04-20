import type { BetsRepository } from "@/domain/repositories/bets.repository";
import { betsRepositoryToken } from "@/domain/repositories/bets.repository";

import type { RoundsRepository } from "@/domain/repositories/rounds.repository";
import { roundsRepositoryToken } from "@/domain/repositories/rounds.repository";

import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { RoundStatus } from "@/domain/enums/rounds";

type CashoutBetInput = {
  betId: string;
};

export class CashoutBetUseCase {
  constructor(
    @Inject(betsRepositoryToken)
    private readonly betsRepository: BetsRepository,
    @Inject(roundsRepositoryToken)
    private readonly roundsRepository: RoundsRepository,
  ) {}

  async execute(input: CashoutBetInput) {
    const bet = await this.betsRepository.findById(input.betId);
    if (!bet) throw new NotFoundException("Bet not found");

    if (bet.cashedOutAt)
      throw new BadRequestException("Bet already cashed out");
    const round = await this.roundsRepository.findById(bet.roundId);

    if (!round) throw new NotFoundException("Round not found");

    if (round.status !== RoundStatus.RUNNING)
      throw new BadRequestException("Round is not running to cashout bets");

    if (!round.crashMultiplier)
      throw new InternalServerErrorException("Internal server error");
    
    round.crashMultiplier;
    bet.cashout();
    const gain = await this.betsRepository.update(bet);
  }
}
