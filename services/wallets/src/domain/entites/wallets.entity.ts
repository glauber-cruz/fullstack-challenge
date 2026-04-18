import { v4 as uuidv4 } from "uuid";
import { Optional } from "../core/optional";

export type WalletProps = {
  id: string;
  userId: string;
  balance: number;
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

  static create(
    props: Optional<WalletProps, "id" | "balance" | "createdAt" | "updatedAt">,
  ) {
    return new Wallet({
      ...props,
      balance: props.balance ?? 0,
    } as WalletProps);
  }
}
