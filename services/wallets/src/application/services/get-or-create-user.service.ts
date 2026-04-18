import { Inject, Injectable } from "@nestjs/common";
import { usersRepositoryToken } from "@/domain/repositories/users.repository";

import type { UsersRepository } from "@/domain/repositories/users.repository";
import type { KeycloakUser } from "@/infrastructure/types/keycloack";

import { User } from "@/domain/entites/users.entity";

@Injectable()
export class GetOrCreateUserService {
  constructor(
    @Inject(usersRepositoryToken)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(input: KeycloakUser) {
    const user = User.create({
      id: input.sub,
      email: input.email,
      name: input.name,
    });

    const newUser = await this.usersRepository.upsert(user);
    
    return newUser;
  }
}
