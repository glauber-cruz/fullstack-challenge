import { BetProcessingStatus, BetStatus } from "../../../src/domain/enums/bet";
import { Bet } from "../../../src/domain/entites/bets.entity";
import { Amount } from "../../../src/domain/value-object/amount";

import { describe, it, expect } from "vitest";
describe("Bet entity", () => {
  it("should create a bet with the correct data and defaults", () => {
    const amount = Amount.create(1500);

    const bet = Bet.create({
      userId: "user-1",
      roundId: "round-1",
      amount,
    });

    expect(bet.id).toBeDefined();
    expect(bet.userId).toBe("user-1");
    expect(bet.roundId).toBe("round-1");
    expect(bet.amount).toBe(amount);
    expect(bet.amount.cents).toBe(1500);
    expect(bet.status).toBe(BetStatus.PENDING);
    expect(bet.processingStatus).toBe(BetProcessingStatus.PROCESSING);
    expect(bet.cashoutMultiplier).toBeUndefined();
    expect(bet.cashedOutAt).toBeUndefined();
  });

  it("should cashout bet and update status, processing and cashout data", () => {
    const bet = Bet.create({
      userId: "user-1",
      roundId: "round-1",
      amount: Amount.create(2000),
    });

    bet.processingStatus = BetProcessingStatus.COMPLETED;
    bet.cashout(2.5);

    expect(bet.status).toBe(BetStatus.CASHED_OUT);
    expect(bet.processingStatus).toBe(BetProcessingStatus.COMPLETED);
    expect(bet.cashoutMultiplier).toBe(2.5);
    expect(bet.cashedOutAt).toBeInstanceOf(Date);
  });

  it("should mark bet as lost and complete processing", () => {
    const bet = Bet.create({
      userId: "user-1",
      roundId: "round-1",
      amount: Amount.create(2000),
    });

    bet.lose();

    expect(bet.status).toBe(BetStatus.LOST);
    expect(bet.processingStatus).toBe(BetProcessingStatus.COMPLETED);
    expect(bet.cashoutMultiplier).toBeUndefined();
    expect(bet.cashedOutAt).toBeUndefined();
  });

  it("should throw when trying to cashout an already cashed out bet", () => {
    const bet = Bet.create({
      userId: "user-1",
      roundId: "round-1",
      amount: Amount.create(2000),
    });

    bet.processingStatus = BetProcessingStatus.COMPLETED;
    bet.cashout(2.5);

    expect(() => bet.cashout(2.7)).toThrow("Bet already cashed out");
  });

  it("should throw when trying to cashout a bet that is not pending", () => {
    const bet = Bet.create({
      userId: "user-1",
      roundId: "round-1",
      amount: Amount.create(2000),
    });

    bet.status = BetStatus.LOST;
    bet.processingStatus = BetProcessingStatus.COMPLETED;

    expect(() => bet.cashout(2.5)).toThrow("Bet is not pending to cashout");
  });

  it("should throw when trying to cashout a bet that is not completed", () => {
    const bet = Bet.create({
      userId: "user-1",
      roundId: "round-1",
      amount: Amount.create(2000),
    });

    expect(() => bet.cashout(2.5)).toThrow("Bet is not completed to cashout");
  });
});
