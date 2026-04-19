import { v4 as uuidv4 } from "uuid";
import { Optional } from "../core/optional";

import { Amount } from "../value-object/amount";

export type BetProps = {
  id: string;
  userId: string;
  roundId: string;
  amount: Amount;
  cashoutMultiplier?: number;
  cashedOutAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Bet {
  private _id: string;
  private props: BetProps;

  private constructor(props: BetProps) {
    this._id = props.id ?? uuidv4();
    this.props = {
      ...props,
      id: this._id,
    };
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this.props.userId;
  }

  get roundId() {
    return this.props.roundId;
  }

  get amount() {
    return this.props.amount;
  }

  get cashoutMultiplier() {
    return this.props.cashoutMultiplier;
  }

  get cashedOutAt() {
    return this.props.cashedOutAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  cashout(cashoutMultiplier: number) {
    this.props.cashoutMultiplier = cashoutMultiplier;
    this.props.cashedOutAt = new Date();
  }

  static create(
    props: Optional<
      BetProps,
      | "id"
      | "cashoutMultiplier"
      | "cashedOutAt"
      | "createdAt"
      | "updatedAt"
    >,
  ) {
    return new Bet(props as BetProps);
  }
}
