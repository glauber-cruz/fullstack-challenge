import { Wallet } from "@/domain/entites/wallets.entity";

import type { Wallets } from "../../../generated/prisma/client";
import { Amount } from "@/domain/value-object/amount";

export class WalletsMapper {
  static toEntity(data: Wallets): Wallet {
    return Wallet.create({
      id: data.id,
      userId: data.userId,
      balance: Amount.create(Number(data.balance)),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static toPrisma(data: Wallet) {
    return {
      id: data.id,
      userId: data.userId,
      balance: data.balance.cents,
    };
  }
}
