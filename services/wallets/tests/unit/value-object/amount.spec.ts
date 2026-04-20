import { describe, expect, it } from "vitest";

import { Amount } from "../../../src/domain/value-object/amount";

describe("Amount value object", () => {
  it("should create amount with integer cents", () => {
    const amount = Amount.create(1234);

    expect(amount.cents).toBe(1234);
    expect(amount.toReais()).toBe(12.34);
  });

  it("should create amount with zero value", () => {
    const amount = Amount.create(0);

    expect(amount.cents).toBe(0);
    expect(amount.toReais()).toBe(0);
  });

  it("should throw when creating amount with decimal value", () => {
    expect(() => Amount.create(12.5)).toThrow(
      "Amount must be in cents (integer value)",
    );
  });

  it("should throw when creating amount with NaN", () => {
    expect(() => Amount.create(Number.NaN)).toThrow(
      "Amount must be in cents (integer value)",
    );
  });
});
