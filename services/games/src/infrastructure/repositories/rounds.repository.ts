import { Injectable } from "@nestjs/common";
import { PrismaService } from "../databases/prisma.service";

import type { RoundsRepository } from "../../domain/repositories/rounds.repository";
import { Round } from "@/domain/entites/rounds.entity";
import { RoundsMapper } from "../mappers/rounds.mapper";

@Injectable()
export class RoundsRepositoryImpl implements RoundsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const row = await this.prisma.rounds.findUnique({
      where: { id },
    });
    return row ? RoundsMapper.toEntity(row) : null;
  }

  async create(round: Round): Promise<void> {
    await this.prisma.rounds.create({
      data: RoundsMapper.toPrismaCreate(round),
    });
  }

  async update(round: Round) {
    const row = await this.prisma.rounds.update({
      where: { id: round.id },
      data: RoundsMapper.toPrismaUpdate(round),
    });
    return RoundsMapper.toEntity(row);
  }
}
