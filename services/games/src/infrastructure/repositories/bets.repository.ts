import { Injectable } from "@nestjs/common";
import { PrismaService } from "../databases/prisma.service";

import type { BetsRepository } from "../../domain/repositories/bets.repository";
import { Bet } from "@/domain/entites/bets.entity";

import { BetsMapper } from "../mappers/bets.mapper";
import { BetStatus } from "@/domain/enums/bet";

@Injectable()
export class BetsRepositoryImpl implements BetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const row = await this.prisma.bets.findUnique({
      where: { id },
    });
    return row ? BetsMapper.toEntity(row) : null;
  }

  async findNotCashoutByRoundId(
    roundId: string,
    perPage: number,
    page: number,
  ) {
    const row = await this.prisma.bets.findMany({
      where: {
        roundId,
        status: BetStatus.PENDING,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return row.map(BetsMapper.toEntity);
  }

  async findByUserAndRound(userId: string, roundId: string) {
    const row = await this.prisma.bets.findUnique({
      where: {
        userId_roundId: { userId, roundId },
      },
    });
    return row ? BetsMapper.toEntity(row) : null;
  }

  async create(bet: Bet): Promise<void> {
    await this.prisma.bets.create({
      data: BetsMapper.toPrismaCreate(bet),
    });
  }

  async update(bet: Bet) {
    const row = await this.prisma.bets.update({
      where: { id: bet.id },
      data: BetsMapper.toPrismaUpdate(bet),
    });
    return BetsMapper.toEntity(row);
  }

  async updateMany(bets: Bet[]) {
    await this.prisma.$transaction(
      bets.map((bet) =>
        this.prisma.bets.update({
          where: { id: bet.id },
          data: BetsMapper.toPrismaUpdate(bet),
        }),
      ),
    );
  }
}
