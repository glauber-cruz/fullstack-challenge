import { Module } from "@nestjs/common";

import { usersRepositoryToken } from "../../domain/repositories/users.repository";
import { roundsRepositoryToken } from "../../domain/repositories/rounds.repository";
import { betsRepositoryToken } from "../../domain/repositories/bets.repository";

import { UsersRepositoryImpl } from "./users.repository";
import { RoundsRepositoryImpl } from "./rounds.repository";
import { BetsRepositoryImpl } from "./bets.repository";

@Module({
  providers: [
    {
      provide: usersRepositoryToken,
      useClass: UsersRepositoryImpl,
    },
    {
      provide: roundsRepositoryToken,
      useClass: RoundsRepositoryImpl,
    },
    {
      provide: betsRepositoryToken,
      useClass: BetsRepositoryImpl,
    },
  ],
  exports: [usersRepositoryToken, roundsRepositoryToken, betsRepositoryToken],
})
export class RepositoryModule {}
