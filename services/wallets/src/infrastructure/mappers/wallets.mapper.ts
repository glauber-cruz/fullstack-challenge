import { Wallet } from "@/domain/entites/wallets.entity";

import type { Wallets } from "../../../generated/prisma/client";

export class WalletsMapper {
  static toEntity(data: Wallets): Wallet {
    return Wallet.create({
      id: data.id,
      userId: data.userId,
      balance: Number(data.balance),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static toPrisma(data: Wallet) {
    return {
      id: data.id,
      userId: data.userId,
      balance: data.balance,
    };
  }
}
