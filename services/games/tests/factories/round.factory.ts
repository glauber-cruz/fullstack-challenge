import { Round } from "@/domain/entites/rounds.entity";
import { RoundStatus } from "@/domain/enums/rounds";

type MakeRoundOverrides = {
  id?: string;
  status?: RoundStatus;
  crashMultiplier?: number;
};

export const makeRound = (overrides: MakeRoundOverrides = {}) =>
  Round.create({
    id: overrides.id ?? "round-1",
    status: overrides.status ?? RoundStatus.RUNNING,
    crashMultiplier: overrides.crashMultiplier,
  });
