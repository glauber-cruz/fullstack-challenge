import { Injectable } from "@nestjs/common";
import { PrismaService } from "../databases/prisma.service";
import { UsersRepository } from "../../domain/repositories/users.repository";
@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}
}
