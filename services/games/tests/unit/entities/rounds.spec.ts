import { Round } from "../../../src/domain/entites/rounds.entity";
import { RoundStatus } from "../../../src/domain/enums/rounds";
import { describe, expect, it } from "vitest";

describe("Round entity", () => {
  it("should create a round with correct data and default pending status", () => {
    const round = Round.create({});

    expect(round.id).toBeDefined();
    expect(round.status).toBe(RoundStatus.PENDING);
    expect(round.crashMultiplier).toBeUndefined();
    expect(round.startAt).toBeUndefined();
    expect(round.endedAt).toBeUndefined();
  });

  it("should run a pending round", () => {
    const round = Round.create({});

    round.run();

    expect(round.status).toBe(RoundStatus.RUNNING);
    expect(round.startAt).toBeInstanceOf(Date);
  });

  it("should end a running round", () => {
    const round = Round.create({});
    round.run();

    round.end();

    expect(round.status).toBe(RoundStatus.CRASHED);
    expect(round.endedAt).toBeInstanceOf(Date);
  });

  it("should throw when trying to run a round that is not pending", () => {
    const round = Round.create({});
    round.run();

    expect(() => round.run()).toThrow("Round is not pending to run");
  });

  it("should throw when trying to end a round that is not running", () => {
    const pendingRound = Round.create({});
    expect(() => pendingRound.end()).toThrow("Round is not running to end");

    const crashedRound = Round.create({});
    crashedRound.run();
    crashedRound.end();
    expect(() => crashedRound.end()).toThrow("Round is not running to end");
  });
});
