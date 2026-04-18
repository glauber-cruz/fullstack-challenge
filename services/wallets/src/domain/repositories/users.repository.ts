import { User } from "../entites/users.entity";

export const usersRepositoryToken = Symbol("UsersRepository");

export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  upsert(user: User): Promise<User>;
}