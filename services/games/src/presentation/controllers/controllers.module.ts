import { Module } from "@nestjs/common";

import { GuardsModule } from "../guards/guards.module";
import { RepositoryModule } from "@/infrastructure/repositories/repository.module";

import { GamesController } from "./health/get.controller";
import { BetsCreateController } from "./bets/create.controller";
import { BetsCashoutController } from "./bets/cashout.controller";
import { BetsGetMeController } from "./bets/get-me.controller";
import { RoundsGetCurrentController } from "./rounds/get-current.controller";
import { RoundsGetVerifyByIdController } from "./rounds/get-verify-by-id.controller";
import { RoundsGetHistoryController } from "./rounds/get-history.controller";

@Module({
  imports: [RepositoryModule, GuardsModule],
  controllers: [
    GamesController,
    BetsCreateController,
    BetsCashoutController,
    BetsGetMeController,
    RoundsGetCurrentController,
    RoundsGetVerifyByIdController,
    RoundsGetHistoryController,
  ],
})
export class ControllersModule {}
