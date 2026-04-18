import { Round } from "@/domain/entites/rounds.entity";
import { RoundStatus } from "@/domain/enums/rounds";

import type { Rounds } from "../../../generated/prisma/client";

export class RoundsMapper {
  static toEntity(data: Rounds): Round {
    return Round.create({
      id: data.id,
      status: data.status as RoundStatus,
      crashMultiplier: data.crashMultiplier ?? undefined,
      startAt: data.startAt ?? undefined,
      endedAt: data.endedAt ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static toPrismaCreate(data: Round) {
    return {
      id: data.id,
      status: data.status,
      crashMultiplier: data.crashMultiplier,
      startAt: data.startAt,
      endedAt: data.endedAt,
    };
  }

  static toPrismaUpdate(data: Round) {
    return {
      status: data.status,
      crashMultiplier: data.crashMultiplier,
      startAt: data.startAt,
      endedAt: data.endedAt,
    };
  }
}
