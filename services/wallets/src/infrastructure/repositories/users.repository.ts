import { PrismaService } from "../databases/prisma.service";

export class UsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}
}