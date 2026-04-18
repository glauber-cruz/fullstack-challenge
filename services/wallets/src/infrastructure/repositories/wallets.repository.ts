import { PrismaService } from "../databases/prisma.service";

export class WalletsRepository implements WalletsRepository {
  constructor(private readonly prisma: PrismaService) {}
}