import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { RepositoryModule } from "@/infrastructure/repositories/repository.module";
import { HasEnoughBalanceUseCase } from "@/application/use-cases/wallets/has-enough-balance";

import { ValidateBetConsumerService } from "./wallets/validate-bet";
import { AddGainConsumerService } from "./wallets/add-gain";

import { AddGainUseCase } from "@/application/use-cases/wallets/add-gain";
import { AddLostConsumerService } from "./wallets/add-lost";

import { AddLostUseCase } from "@/application/use-cases/wallets/add-lost";

@Module({
  imports: [
    RepositoryModule,
    ClientsModule.register([
      {
        name: "GAMES_RMQ_CLIENT",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? ""],
          queue: "bets_queue",
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [
    ValidateBetConsumerService,
    AddGainConsumerService,
    AddLostConsumerService,
  ],
  providers: [HasEnoughBalanceUseCase, AddGainUseCase, AddLostUseCase],
})
export class MessagesModule {}
