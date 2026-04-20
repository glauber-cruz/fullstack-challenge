import { Module } from "@nestjs/common";

import { RepositoryModule } from "@/infrastructure/repositories/repository.module";
import { HasEnoughBalanceUseCase } from "@/application/use-cases/wallets/has-enough-balance";
import { ValidateBetConsumerService } from "./wallets/validate-bet";

@Module({
  imports: [RepositoryModule],
  controllers: [ValidateBetConsumerService],
  providers: [HasEnoughBalanceUseCase],
})
export class MessagesModule {}
