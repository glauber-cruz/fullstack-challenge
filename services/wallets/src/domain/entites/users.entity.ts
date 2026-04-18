import { v4 as uuidv4 } from "uuid";
import { Optional } from "../core/optional";

export type UserProps = {
  id: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User {
  private _id: string;
  private props: UserProps;

  private constructor(props: UserProps) {
    this._id = props.id ?? uuidv4();
    this.props = {
      ...props,
      id: this._id,
    };
  }

  get id() {
    return this._id;
  }

  get email() {
    return this.props.email;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<UserProps, "id" | "createdAt" | "updatedAt">) {
    return new User(props as UserProps);
  }
}
