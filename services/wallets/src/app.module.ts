import { Module } from "@nestjs/common";
import { HealthController } from "./presentation/controllers/wallet/health.controller";

import { DatabaseModule } from "./infrastructure/databases/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [HealthController],
})
export class AppModule {}
