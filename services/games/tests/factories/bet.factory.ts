import { faker } from "@faker-js/faker";

import { Bet } from "@/domain/entites/bets.entity";
import { BetProcessingStatus, BetStatus } from "@/domain/enums/bet";
import { Amount } from "@/domain/value-object/amount";

type MakeBetOverrides = {
  id?: string;
  roundId?: string;
  status?: BetStatus;
  processingStatus?: BetProcessingStatus;
  cashedOutAt?: Date;
};

export const makeBet = (overrides: MakeBetOverrides = {}) =>
  Bet.create({
    id: overrides.id ?? faker.string.uuid(),
    userId: "user-1",
    roundId: overrides.roundId ?? "round-1",
    amount: Amount.create(1000),
    status: overrides.status ?? BetStatus.PENDING,
    processingStatus:
      overrides.processingStatus ?? BetProcessingStatus.COMPLETED,
    cashedOutAt: overrides.cashedOutAt,
  });
