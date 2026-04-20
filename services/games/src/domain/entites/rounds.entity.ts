import { v4 as uuidv4 } from "uuid";
import { Optional } from "../core/optional";
import { RoundStatus } from "../enums/rounds";

export type RoundProps = {
  id: string;
  status: RoundStatus;
  crashMultiplier: number;
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
      crashMultiplier: props.crashMultiplier ?? this.calculateCrashMultiplier(),
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

  run() {
    if (this.props.status !== RoundStatus.PENDING)
      throw new Error("Round is not pending to run");

    this.props.status = RoundStatus.RUNNING;
    this.props.startAt = new Date();
  }

  calculateCrashMultiplier() {
    // 1% de vantagem pra casa... hmm talvez a gente devesse ser mais ladrãos né kakaka
    const houseEdge = 0.99;
    const maxRandomNumber = 1;

    const randomNumber = Math.random();
    const randomNumberDistanceFromZero = maxRandomNumber - randomNumber;

    const crash = (1 / randomNumberDistanceFromZero) * houseEdge;
    let formattedCrash = Number(crash.toFixed(2));

    const maxCrashMultiplier = 100;
    const minCrashMultiplier = 1;

    if(formattedCrash > maxCrashMultiplier) formattedCrash = maxCrashMultiplier;
    return Math.max(minCrashMultiplier, formattedCrash)
  }

  end() {
    if (this.props.status !== RoundStatus.RUNNING)
      throw new Error("Round is not running to end");

    this.props.status = RoundStatus.CRASHED;
    this.props.endedAt = new Date();
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
