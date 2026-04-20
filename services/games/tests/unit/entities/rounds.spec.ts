import { Round } from "../../../src/domain/entites/rounds.entity";
import { RoundStatus } from "../../../src/domain/enums/rounds";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("Round entity", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create a round with correct data and default pending status", () => {
    const round = Round.create({});

    expect(round.id).toBeDefined();
    expect(round.status).toBe(RoundStatus.PENDING);
    expect(round.crashMultiplier).toBeGreaterThanOrEqual(1);
    expect(round.crashMultiplier).toBeLessThanOrEqual(100);
    expect(round.startAt).toBeUndefined();
    expect(round.endedAt).toBeUndefined();
  });

  it("should preserve crashMultiplier when explicitly provided", () => {
    const round = Round.create({ crashMultiplier: 7.25 });

    expect(round.crashMultiplier).toBe(7.25);
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

  it("should calculate crashMultiplier with 2 decimal precision", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    const round = Round.create({});

    expect(round.crashMultiplier).toBe(1.98);
  });

  it("should clamp calculated crashMultiplier to maximum 100", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99999);

    const round = Round.create({});

    expect(round.crashMultiplier).toBe(100);
  });

  it("should clamp calculated crashMultiplier to minimum 1", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const round = Round.create({});

    expect(round.crashMultiplier).toBe(1);
  });
});
