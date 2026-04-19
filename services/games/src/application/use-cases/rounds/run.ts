import type { RoundsRepository } from "@/domain/repositories/rounds.repository";
import { roundsRepositoryToken } from "@/domain/repositories/rounds.repository";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class RunRoundUseCase {
  constructor(
    @Inject(roundsRepositoryToken)
    private readonly roundsRepository: RoundsRepository,
  ) {}

  async execute(roundId: string) {
    const round = await this.roundsRepository.findById(roundId);
    if (!round) throw new NotFoundException("Round not found");

    round.run();
    await this.roundsRepository.update(round);
  }
}
