export class Amount {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number) {
    Amount.validate(value);
    return new Amount(value);
  }

  private static validate(value: number) {
    if (!Number.isInteger(value)) {
      throw new Error("Amount must be in cents (integer value)");
    }
  }

  get cents() {
    return this.value;
  }

  toReais() {
    return this.value / 100;
  }
}
