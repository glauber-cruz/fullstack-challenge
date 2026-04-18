import { Injectable } from "@nestjs/common";
import { PrismaService } from "../databases/prisma.service";

import type { UsersRepository } from "../../domain/repositories/users.repository";
import { User } from "@/domain/entites/users.entity";
import { UsersMapper } from "../mappers/users.mapper";

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    return user ? UsersMapper.toEntity(user) : null;
  }

  async upsert(user: User) {
    const prismaUser = UsersMapper.toPrisma(user);

    const newUserData = await this.prisma.users.upsert({
      where: { id: user.id },
      create: prismaUser,
      update: {
        email: prismaUser.email,
        name: prismaUser.name,
      },
    });
    return UsersMapper.toEntity(newUserData);
  }
}
