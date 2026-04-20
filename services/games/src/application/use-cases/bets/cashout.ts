import type { BetsRepository } from "@/domain/repositories/bets.repository";
import { betsRepositoryToken } from "@/domain/repositories/bets.repository";

import type { RoundsRepository } from "@/domain/repositories/rounds.repository";
import { roundsRepositoryToken } from "@/domain/repositories/rounds.repository";

import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Injectable,
} from "@nestjs/common";
import { RoundStatus } from "@/domain/enums/rounds";
import { RedisService } from "@/infrastructure/cache/redis.service";
import { ClientProxy } from "@nestjs/microservices";
import { BetProcessingStatus } from "@/domain/enums/bet";

type CashoutBetInput = {
  betId: string;
};

@Injectable()
export class CashoutBetUseCase {
  constructor(
    @Inject(betsRepositoryToken)
    private readonly betsRepository: BetsRepository,
    @Inject(roundsRepositoryToken)
    private readonly roundsRepository: RoundsRepository,
    private readonly redisService: RedisService,
    @Inject("WALLETS_RMQ_CLIENT")
    private readonly walletsClient: ClientProxy,
  ) {}

  async execute(input: CashoutBetInput) {
    const bet = await this.betsRepository.findById(input.betId);
    if (!bet) throw new NotFoundException("Bet not found");

    const round = await this.roundsRepository.findById(bet.roundId);
    if (!round) throw new NotFoundException("Round not found");

    if (round.status !== RoundStatus.RUNNING)
      throw new BadRequestException("Round is not running to cashout bets");

    if (!round.crashMultiplier)
      throw new InternalServerErrorException("Internal server error");

    const currentMultiplier = await this.redisService
      .getClient()
      .get(`round:${round.id}:multiplier`);

    if (!currentMultiplier)
      throw new InternalServerErrorException("Internal server error");

    const cashoutMultiplier = Number(currentMultiplier);

    if (!cashoutMultiplier)
      throw new InternalServerErrorException("Internal server error");

    try {
      bet.cashout(cashoutMultiplier);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const gainInCents = Math.floor(bet.amount.cents * cashoutMultiplier);

    this.walletsClient.emit("add_gain", {
      userId: bet.userId,
      gainInCents,
    });

    await this.betsRepository.update(bet);
  }
}
