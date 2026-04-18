import { User } from "@/domain/entites/users.entity";

import type { Users } from "../../../generated/prisma/client";

export class UsersMapper {
  static toEntity(data: Users): User {
    return User.create({
      id: data.id,
      email: data.email ?? undefined,
      name: data.name ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static toPrisma(data: User) {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
    };
  }
}
