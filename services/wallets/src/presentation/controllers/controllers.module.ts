import { Module } from "@nestjs/common";
import { CreateWalletController } from "./wallets/create.controller";

import { GetWalletController } from "./wallets/get.controller";
import { HealthController } from "./wallets/health.controller";

import { CreateWalletUseCase } from "@/application/use-cases/wallets/create";
import { RepositoryModule } from "@/infrastructure/repositories/repository.module";
import { GetWalletMeQueryBuilder } from "@/infrastructure/query-builders/wallets/get-me";

@Module({
  imports: [RepositoryModule],
  controllers: [CreateWalletController, GetWalletController, HealthController],
  providers: [CreateWalletUseCase, GetWalletMeQueryBuilder],
})
export class ControllersModule {}
