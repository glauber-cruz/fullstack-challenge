import { Global, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { RepositoryModule } from "@/infrastructure/repositories/repository.module";
import { ProcessBetConsumerService } from "./bets/process";

import { ProcessBetUseCase } from "@/application/use-cases/bets/process";

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: "WALLETS_RMQ_CLIENT",
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
  controllers: [ProcessBetConsumerService],
  providers: [ProcessBetUseCase],
  exports: [ClientsModule],
})
export class MessagesModule {}
