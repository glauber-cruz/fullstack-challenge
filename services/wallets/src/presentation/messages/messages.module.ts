import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { RepositoryModule } from "@/infrastructure/repositories/repository.module";
import { HasEnoughBalanceUseCase } from "@/application/use-cases/wallets/has-enough-balance";
import { ValidateBetConsumerService } from "./wallets/validate-bet";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "RABBITMQ_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? ""],
          queue: "wallets_queue",
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    RepositoryModule,
  ],
  controllers: [ValidateBetConsumerService],
  providers: [HasEnoughBalanceUseCase],
})
export class MessagesModule {}
