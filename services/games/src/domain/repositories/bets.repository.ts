import type { Bet } from "../entites/bets.entity";

export const betsRepositoryToken = Symbol("BetsRepository");

export interface BetsRepository {
  findById(id: string): Promise<Bet | null>;
  findNotCashoutByRoundId(
    roundId: string,
    perPage: number,
    page: number,
  ): Promise<Bet[]>;
  findByUserAndRound(userId: string, roundId: string): Promise<Bet | null>;
  create(bet: Bet): Promise<void>;
  update(bet: Bet): Promise<Bet>;
  updateMany(bets: Bet[]): Promise<void>;
}
