import { Round } from "@/domain/entites/rounds.entity";
import { RoundStatus } from "@/domain/enums/rounds";

import type { RoundsRepository } from "@/domain/repositories/rounds.repository";
import { roundsRepositoryToken } from "@/domain/repositories/rounds.repository";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateRoundUseCase {
  constructor(
    @Inject(roundsRepositoryToken)
    private readonly roundsRepository: RoundsRepository,
  ) {}

  async execute() {
    const round = Round.create({
      status: RoundStatus.PENDING,
    });
    await this.roundsRepository.create(round);

    return { roundId: round.id, crashMultiplier: round.crashMultiplier };
  }
}
