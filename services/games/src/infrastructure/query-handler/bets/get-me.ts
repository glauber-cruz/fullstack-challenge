import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../databases/prisma.service";

import { CursorPagination } from "@/domain/core/cursor-pagination";
import { GetBetsMeResponse } from "@/presentation/dtos/bets/get-me.dto";

export type GetBetsMeInput = {
  userId: string;
  nextCursor?: string;
  limit: number;
};

@Injectable()
export class GetBetsMeQueryHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: GetBetsMeInput): Promise<GetBetsMeResponse> {
    const bets = await this.prisma.bets.findMany({
      where: { userId: input.userId },
      take: input.limit + 1,
      skip: input.nextCursor ? 1 : 0,
      cursor: input.nextCursor ? { id: input.nextCursor } : undefined,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    return CursorPagination.create(bets, input.limit);
  }
}
