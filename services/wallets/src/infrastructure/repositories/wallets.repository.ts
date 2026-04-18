import { PrismaService } from "../databases/prisma.service";
import { WalletsRepository } from "../../domain/repositories/wallets.repository";
import { Injectable } from "@nestjs/common";
@Injectable()
export class WalletsRepositoryImpl implements WalletsRepository {
  constructor(private readonly prisma: PrismaService) {}
}
