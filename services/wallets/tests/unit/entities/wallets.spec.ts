import { describe, expect, it } from "vitest";

import { Amount } from "../../../src/domain/value-object/amount";
import { Wallet } from "../../../src/domain/entites/wallets.entity";

describe("Wallet entity", () => {
  it("should create wallet successfully", () => {
    const wallet = Wallet.create({
      userId: "user-1",
    });

    expect(wallet.id).toBeDefined();
    expect(wallet.userId).toBe("user-1");
    expect(wallet.balance.cents).toBe(0);
    expect(wallet.createdAt).toBeUndefined();
    expect(wallet.updatedAt).toBeUndefined();
  });

  it("should update balance correctly in cents on gain", () => {
    const wallet = Wallet.create({
      userId: "user-1",
      balance: Amount.create(1000),
    });

    wallet.gain(500);

    expect(wallet.balance.cents).toBe(1500);
  });

  it("should update balance correctly on lose", () => {
    const wallet = Wallet.create({
      userId: "user-1",
      balance: Amount.create(1000),
    });

    wallet.lose(400);

    expect(wallet.balance.cents).toBe(600);
  });

  it("should not reduce balance below zero on lose", () => {
    const wallet = Wallet.create({
      userId: "user-1",
      balance: Amount.create(500),
    });

    wallet.lose(1000);

    expect(wallet.balance.cents).toBe(0);
  });

  it("should not apply negative value on gain", () => {
    const wallet = Wallet.create({
      userId: "user-1",
      balance: Amount.create(700),
    });

    wallet.gain(-200);

    expect(wallet.balance.cents).toBe(700);
  });
});
