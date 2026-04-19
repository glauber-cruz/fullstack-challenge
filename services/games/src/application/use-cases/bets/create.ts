import {
  BetsRepository,
  betsRepositoryToken,
} from "@/domain/repositories/bets.repository";

import {
  RoundsRepository,
  roundsRepositoryToken,
} from "@/domain/repositories/rounds.repository";

import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { KeycloakUser } from "@/infrastructure/types/keycloack";

import { GetOrCreateUserService } from "../../services/get-or-create-user.service";
import { Bet } from "@/domain/entites/bets.entity";

import { RoundStatus } from "generated/prisma/client";

type CreateBetInput = {
  user: KeycloakUser;
  roundId: string;
  amount: number;
};

@Injectable()
export class CreateBetUseCase {
  constructor(
    @Inject(betsRepositoryToken)
    private readonly betsRepository: BetsRepository,
    @Inject(roundsRepositoryToken)
    private readonly roundsRepository: RoundsRepository,
    private readonly getOrCreateUserService: GetOrCreateUserService,
  ) {}

  async execute(input: CreateBetInput) {
    const user = await this.getOrCreateUserService.execute(input.user);
    const round = await this.roundsRepository.findById(input.roundId);

    if (!round) throw new NotFoundException("Round not found");
    if (round.status === RoundStatus.RUNNING)
      throw new BadRequestException("Round is already running");

    const bet = Bet.create({
      userId: user.id,
      roundId: round.id,
      amount: input.amount,
    });

    await this.betsRepository.create(bet);
  }
}
