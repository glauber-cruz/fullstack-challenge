import { v4 as uuidv4 } from "uuid";
import { Optional } from "../core/optional";

import { Amount } from "../value-object/amount";
import { BetProcessingStatus, BetStatus } from "../enums/bet";

export type BetProps = {
  id: string;
  userId: string;
  roundId: string;
  amount: Amount;
  cashoutMultiplier?: number;
  cashedOutAt?: Date;
  status: BetStatus;
  processingStatus: BetProcessingStatus;
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
      amount: props.amount ?? Amount.create(0),
      status: props.status ?? BetStatus.PENDING,
      processingStatus:
        props.processingStatus ?? BetProcessingStatus.PROCESSING,
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

  get status() {
    return this.props.status;
  }

  get processingStatus() {
    return this.props.processingStatus;
  }

  set processingStatus(status: BetProcessingStatus) {
    this.props.processingStatus = status;
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

  cashout() {
    this.props.cashedOutAt = new Date();
    this.props.status = BetStatus.CASHED_OUT;
  }

  static create(
    props: Optional<
      BetProps,
      | "id"
      | "cashoutMultiplier"
      | "cashedOutAt"
      | "createdAt"
      | "updatedAt"
      | "status"
      | "processingStatus"
    >,
  ) {
    return new Bet(props as BetProps);
  }
}
