import { v4 as uuidv4 } from "uuid";
import { Optional } from "../core/optional";

import { Amount } from "../value-object/amount";

export type WalletProps = {
  id: string;
  userId: string;
  balance: Amount;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Wallet {
  private _id: string;
  private props: WalletProps;

  private constructor(props: WalletProps) {
    this._id = props.id ?? uuidv4();
    this.props = {
      ...props,
      id: this._id,
      balance: props.balance ?? Amount.create(0),
    };
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this.props.userId;
  }

  get balance() {
    return this.props.balance;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  gain(gainInCents: number) {
    this.props.balance = Amount.create(this.props.balance.cents + gainInCents);
  }

  lose(lostInCents: number) {
    let newBalance = this.props.balance.cents - lostInCents;
    if (newBalance < 0) newBalance = 0;
    this.props.balance = Amount.create(newBalance);
  }

  static create(
    props: Optional<WalletProps, "id" | "balance" | "createdAt" | "updatedAt">,
  ) {
    return new Wallet({
      ...props,
    } as WalletProps);
  }
}
