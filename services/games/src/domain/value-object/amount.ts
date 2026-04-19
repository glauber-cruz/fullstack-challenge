import {
  centavosParaReais,
  reaisInteirosParaCentavos,
  type ReaisInteirosParaCentavosOptions,
} from "../core/cents";

export class Amount {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number) {
    Amount.validate(value);
    return new Amount(value);
  }

  /** Montante a partir de **reais inteiros** (ex.: `Amount.fromReaisInteiros(1000)` → 100_000 centavos). */
  static fromReaisInteiros(
    reais: number,
    options?: ReaisInteirosParaCentavosOptions,
  ) {
    return Amount.create(reaisInteirosParaCentavos(reais, options));
  }

  private static validate(value: number) {
    if (!Number.isInteger(value)) {
      throw new Error("Amount must be in cents (integer value)");
    }

    if (value <= 0) {
      throw new Error("Amount must be greater than zero");
    }
  }

  get cents() {
    return this.value;
  }

  toReais() {
    return centavosParaReais(this.value);
  }
}
