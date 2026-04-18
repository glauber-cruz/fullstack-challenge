import { Module } from "@nestjs/common";
import { CreateWalletController } from "./wallet/create.controller";
import { GetWalletController } from "./wallet/get.controller";
import { HealthController } from "./wallet/health.controller";

@Module({
  imports: [],
  controllers: [CreateWalletController, GetWalletController, HealthController],
  providers: [],
})
export class ControllersModule {}
