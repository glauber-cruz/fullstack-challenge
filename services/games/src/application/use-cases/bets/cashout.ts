import {
  BetsRepository,
  betsRepositoryToken,
} from "@/domain/repositories/bets.repository";

import {
  RoundsRepository,
  roundsRepositoryToken,
} from "@/domain/repositories/rounds.repository";

import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { RoundStatus } from "@/domain/enums/rounds";

type CashoutBetInput = {
  betId: string;
  cashoutMultiplier: number;
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

    if(bet.cashedOutAt) throw new BadRequestException("Bet already cashed out");
    const round = await this.roundsRepository.findById(bet.roundId);

    if (!round) throw new NotFoundException("Round not found");
    
    if (round.status !== RoundStatus.RUNNING)
      throw new BadRequestException("Round is not running to cashout bets");

    let cashoutMultiplier: number;

    try {
      cashoutMultiplier = round.currentCrashMultiplier();
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    bet.cashout(cashoutMultiplier);
    await this.betsRepository.update(bet);
  }
}
