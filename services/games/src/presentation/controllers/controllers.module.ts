import { Module } from "@nestjs/common";

import { GuardsModule } from "../guards/guards.module";
import { RepositoryModule } from "@/infrastructure/repositories/repository.module";

import { GamesController } from "./health/get.controller";
import { BetsCreateController } from "./bets/create.controller";

import { BetsCashoutController } from "./bets/cashout.controller";
import { BetsGetMeController } from "./bets/get-me.controller";

import { RoundsGetCurrentController } from "./rounds/get-current.controller";
import { RoundsGetVerifyByIdController } from "./rounds/get-verify-by-id.controller";

import { RoundsFetchHistoryController } from "./rounds/fetch-history.controller";
import { CreateBetUseCase } from "@/application/use-cases/bets/create";

import { GetOrCreateUserService } from "@/application/services/get-or-create-user.service";
import { GetBetsMeQueryHandler } from "@/infrastructure/query-handler/bets/get-me";
import { FetchRoundsHistoryQueryHandler } from "@/infrastructure/query-handler/rounds/fetch-history";

@Module({
  imports: [RepositoryModule, GuardsModule],
  controllers: [
    GamesController,
    BetsCreateController,
    BetsCashoutController,
    BetsGetMeController,
    RoundsGetCurrentController,
    RoundsGetVerifyByIdController,
    RoundsFetchHistoryController,
  ],
  providers: [
    GetOrCreateUserService,
    CreateBetUseCase,
    GetBetsMeQueryHandler,
    FetchRoundsHistoryQueryHandler,
  ],
})
export class ControllersModule {}
