import { Module } from "@nestjs/common";
import { CreateWalletController } from "./wallets/create.controller";

import { GetWalletController } from "./wallets/get.controller";
import { HealthController } from "./wallets/health.controller";

import { CreateWalletUseCase } from "@/application/use-cases/wallets/create";
import { RepositoryModule } from "@/infrastructure/repositories/repository.module";
import { GetWalletMeQueryBuilder } from "@/infrastructure/query-builders/wallets/get-me";
import { GuardsModule } from "../guards/guards.module";

@Module({
  imports: [RepositoryModule, GuardsModule],
  controllers: [CreateWalletController, GetWalletController, HealthController],
  providers: [CreateWalletUseCase, GetWalletMeQueryBuilder],
})
export class ControllersModule {}
