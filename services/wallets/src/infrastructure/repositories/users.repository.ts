import { Injectable } from "@nestjs/common";
import { PrismaService } from "../databases/prisma.service";

import type { UsersRepository } from "../../domain/repositories/users.repository";
import { User } from "@/domain/entites/users.entity";

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    return user
      ? User.create({
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
      : null;
  }

  async upsert(user: User) {
    const newUserData = await this.prisma.users.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      update: {
        email: user.email,
        name: user.name,
      },
    });
    return User.create({
      id: newUserData.id,
      email: newUserData.email ?? undefined,
      name: newUserData.name ?? undefined,
      createdAt: newUserData.createdAt,
      updatedAt: newUserData.updatedAt,
    });
  }
}
