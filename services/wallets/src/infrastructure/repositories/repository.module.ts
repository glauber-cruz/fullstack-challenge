import { Module } from "@nestjs/common";
import { UsersRepositoryImpl } from "./users.repository";

import { WalletsRepositoryImpl } from "./wallets.repository";
import { usersRepositoryToken } from "../../domain/repositories/users.repository";

import { walletsRepositoryToken } from "../../domain/repositories/wallets.repository";

@Module({
  providers: [
    {
      provide: usersRepositoryToken,
      useClass: UsersRepositoryImpl,
    },
    {
      provide: walletsRepositoryToken,
      useClass: WalletsRepositoryImpl,
    },
  ],
  exports: [usersRepositoryToken, walletsRepositoryToken],
})
export class RepositoryModule {}
