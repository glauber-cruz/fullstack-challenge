import { Round } from "@/domain/entites/rounds.entity";
import { RoundStatus } from "@/domain/enums/rounds";

import type { RoundsRepository } from "@/domain/repositories/rounds.repository";
import { roundsRepositoryToken } from "@/domain/repositories/rounds.repository";

import { Inject, Injectable } from "@nestjs/common";

type CreateRoundInput = {
  crashMultiplier: number;
};

@Injectable()
export class CreateRoundUseCase {
  constructor(
    @Inject(roundsRepositoryToken)
    private readonly roundsRepository: RoundsRepository,
  ) {}

  async execute(input: CreateRoundInput) {
    const round = Round.create({
      crashMultiplier: input.crashMultiplier,
      status: RoundStatus.PENDING,
    });
    await this.roundsRepository.create(round);

    return round.id;
  }
}
