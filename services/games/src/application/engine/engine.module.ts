import { Module } from "@nestjs/common";
import { GameEngine } from "./game";
import { RepositoryModule } from "@/infrastructure/repositories/repository.module";

import { CreateRoundUseCase } from "../use-cases/rounds/create";
import { RunRoundUseCase } from "../use-cases/rounds/run";

import { EndRoundUseCase } from "../use-cases/rounds/end";
import { LoseNotCashoutBetsUseCase } from "../use-cases/bets/lose-not-cashout-bets";

@Module({
  imports: [RepositoryModule],
  providers: [
    GameEngine,
    CreateRoundUseCase,
    RunRoundUseCase,
    EndRoundUseCase,
    LoseNotCashoutBetsUseCase,
  ],
  exports: [GameEngine],
})
export class EngineModule {}
