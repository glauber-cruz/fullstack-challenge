import { PrismaService } from "../databases/prisma.service";
import type { WalletsRepository } from "../../domain/repositories/wallets.repository";

import { Injectable } from "@nestjs/common";
import { Wallet } from "@/domain/entites/wallets.entity";

import { WalletsMapper } from "../mappers/wallets.mapper";
@Injectable()
export class WalletsRepositoryImpl implements WalletsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async userHasWallet(userId: string): Promise<boolean> {
    const wallet = await this.prisma.wallets.findFirst({
      where: { userId },
      select: { id: true },
    });
    return wallet !== null;
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallets.findFirst({
      where: { userId },
    });
    return wallet ? WalletsMapper.toEntity(wallet) : null;
  }

  async create(wallet: Wallet): Promise<void> {
    await this.prisma.wallets.create({
      data: WalletsMapper.toPrisma(wallet),
    });
  }

  async save(wallet: Wallet): Promise<void> {
    await this.prisma.wallets.update({
      where: { id: wallet.id },
      data: WalletsMapper.toPrismaUpdate(wallet),
    });
  }
}
