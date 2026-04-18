import { PrismaService } from "../databases/prisma.service";
import type { WalletsRepository } from "../../domain/repositories/wallets.repository";

import { Injectable } from "@nestjs/common";
import { Wallet } from "@/domain/entites/wallets.entity";
@Injectable()
export class WalletsRepositoryImpl implements WalletsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async userHasWallet(userId: string): Promise<boolean> {
    const wallet = await this.prisma.wallets.findFirst({
      where: { userId },
      select: {id: true, },
    });
    return wallet !== null;
  }

  async create(wallet: Wallet): Promise<void> {
    await this.prisma.wallets.create({
      data: {
        id: wallet.id,
        userId: wallet.userId,
        balance: wallet.balance,
      },
    });
  }
}
