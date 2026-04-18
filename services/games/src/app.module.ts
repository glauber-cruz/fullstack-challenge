import { Module } from "@nestjs/common";
import { DatabaseModule } from "./infrastructure/databases/database.module";
import { RepositoryModule } from "./infrastructure/repositories/repository.module";
import { GamesController } from "./presentation/controllers/games.controller";

@Module({
  imports: [DatabaseModule, RepositoryModule],
  controllers: [GamesController],
})
export class AppModule {}
