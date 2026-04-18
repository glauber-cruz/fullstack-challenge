import type { Round } from "../entites/rounds.entity";

export const roundsRepositoryToken = Symbol("RoundsRepository");

export interface RoundsRepository {
  findById(id: string): Promise<Round | null>;
  create(round: Round): Promise<void>;
  update(round: Round): Promise<Round>;
}
