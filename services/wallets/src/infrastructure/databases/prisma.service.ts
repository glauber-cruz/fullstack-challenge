import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";

import { Pool } from "pg";
import { PrismaClient } from "../../../generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly pool: Pool;
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      console.error("DATABASE_URL is not set");
      throw new Error("Internal server error");
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit(): Promise<void> {
    await this.connectWithRetry();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    await this.pool.end();
  }

  private async connectWithRetry(retries = 5): Promise<void> {
    try {
      await this.$connect();
      this.logger.log("✅ Prisma connected");
    } catch (err) {

      if (retries === 0) {
        this.logger.error("❌ Prisma failed to connect");
        throw err;
      }

      this.logger.warn(`⚠️ Retry connection... (${retries} left)`);
      await this.delay(2000);
      return this.connectWithRetry(retries - 1);
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
