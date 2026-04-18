import type { Bet } from "../entites/bets.entity";

export const betsRepositoryToken = Symbol("BetsRepository");

export interface BetsRepository {
  findById(id: string): Promise<Bet | null>;
  findByUserAndRound(userId: string, roundId: string): Promise<Bet | null>;
  create(bet: Bet): Promise<void>;
  update(bet: Bet): Promise<Bet>;
}
