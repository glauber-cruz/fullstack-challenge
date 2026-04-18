import { Bet } from "@/domain/entites/bets.entity";

import type { Bets } from "../../../generated/prisma/client";

export class BetsMapper {
  static toEntity(data: Bets): Bet {
    return Bet.create({
      id: data.id,
      userId: data.userId,
      roundId: data.roundId,
      amount: Number(data.amount),
      cashoutMultiplier: data.cashoutMultiplier ?? undefined,
      cashedOutAt: data.cashedOutAt ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static toPrismaCreate(data: Bet) {
    return {
      id: data.id,
      userId: data.userId,
      roundId: data.roundId,
      amount: data.amount,
      cashoutMultiplier: data.cashoutMultiplier,
      cashedOutAt: data.cashedOutAt,
    };
  }

  static toPrismaUpdate(data: Bet) {
    return {
      amount: data.amount,
      cashoutMultiplier: data.cashoutMultiplier,
      cashedOutAt: data.cashedOutAt,
    };
  }
}
