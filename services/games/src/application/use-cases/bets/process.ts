import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Inject } from "@nestjs/common";

import { betsRepositoryToken } from "@/domain/repositories/bets.repository";
import type { BetsRepository } from "@/domain/repositories/bets.repository";

import { BetProcessingStatus } from "@/domain/enums/bet";

type ProcessBetInput = {
  betId: string;
  isValid: boolean;
};

@Injectable()
export class ProcessBetUseCase {
  constructor(
    @Inject(betsRepositoryToken)
    private readonly betsRepository: BetsRepository,
  ) {}

  async execute(input: ProcessBetInput) {
    const bet = await this.betsRepository.findById(input.betId);
    if (!bet) throw new NotFoundException("Bet not found");

    if (bet.processingStatus !== BetProcessingStatus.PROCESSING)
      throw new BadRequestException("Bet is already processed");

    const processingStatus = input.isValid
      ? BetProcessingStatus.COMPLETED
      : BetProcessingStatus.FAILED;

    bet.processingStatus = processingStatus;
    await this.betsRepository.update(bet);
  }
}
