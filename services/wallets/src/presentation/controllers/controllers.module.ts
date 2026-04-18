import { Module } from "@nestjs/common";
import { CreateWalletController } from "./wallet/create.controller";

import { GetWalletController } from "./wallet/get.controller";
import { HealthController } from "./wallet/health.controller";

import { CreateWalletUseCase } from "@/application/use-cases/wallet/create";
import { RepositoryModule } from "@/infrastructure/repositories/repository.module";

@Module({
  imports: [RepositoryModule],
  controllers: [CreateWalletController, GetWalletController, HealthController],
  providers: [CreateWalletUseCase],
})
export class ControllersModule {}
