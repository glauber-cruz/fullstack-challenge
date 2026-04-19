import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../databases/prisma.service";
import { CursorPagination } from "@/domain/core/cursor-pagination";

type FetchRoundsHistoryInput = {
  nextCursor?: string;
  limit: number;
};

@Injectable()
export class FetchRoundsHistoryQueryHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: FetchRoundsHistoryInput) {
    const rounds = await this.prisma.rounds.findMany({
      take: input.limit + 1,
      skip: input.nextCursor ? 1 : 0,
      cursor: input.nextCursor ? { id: input.nextCursor } : undefined,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        status: true,
        startAt: true,
        endedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return CursorPagination.create(rounds, input.limit);
  }
}