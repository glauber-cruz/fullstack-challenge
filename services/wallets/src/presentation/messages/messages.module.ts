import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { RepositoryModule } from "@/infrastructure/repositories/repository.module";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "RABBITMQ_SERVICE",
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
    RepositoryModule,
  ],
  controllers: [ProcessBetConsumerService],
  providers: [ProcessBetUseCase],
})
export class MessagesModule {}
