import { v4 as uuidv4 } from "uuid";
import { Optional } from "../core/optional";
import { RoundStatus } from "../enums/rounds";

export type RoundProps = {
  id: string;
  status: RoundStatus;
  crashMultiplier?: number;
  startAt?: Date;
  endedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Round {
  private _id: string;
  private props: RoundProps;

  private constructor(props: RoundProps) {
    this._id = props.id ?? uuidv4();
    this.props = {
      ...props,
      id: this._id,
    };
  }

  get id() {
    return this._id;
  }

  get status() {
    return this.props.status;
  }

  get crashMultiplier() {
    return this.props.crashMultiplier;
  }

  currentCrashMultiplier() {
    if (!this.props.startAt || !this.props.crashMultiplier) 
      throw new Error("Round is not started or crash multiplier is not set");
    
    const now = Date.now();

    const start = this.props.startAt.getTime();
    const elapsed = now - start;

    const speed = 1.00007;
    const multiplier = Math.pow(speed, elapsed);

    const max = this.props.crashMultiplier ;
    return Math.min(multiplier, max);
  }

  get startAt() {
    return this.props.startAt;
  }

  get endedAt() {
    return this.props.endedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<
      RoundProps,
      | "id"
      | "status"
      | "crashMultiplier"
      | "startAt"
      | "endedAt"
      | "createdAt"
      | "updatedAt"
    >,
  ) {
    return new Round({
      ...props,
      status: props.status ?? "PENDING",
    } as RoundProps);
  }
}
