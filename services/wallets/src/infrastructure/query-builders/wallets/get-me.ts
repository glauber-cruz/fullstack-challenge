import { GetWalletMeResponse } from "@/presentation/dtos/wallet/get-me.dto";
import { PrismaService } from "../../databases/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetWalletMeQueryBuilder {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<GetWalletMeResponse | null> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!wallet) return null;

    return wallet;
  }
}
