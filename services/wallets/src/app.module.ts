import { Module } from "@nestjs/common";
import { HealthController } from "./presentation/controllers/wallet/health.controller";

@Module({
  controllers: [HealthController],
})
export class AppModule {}
