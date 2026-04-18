import { Module } from "@nestjs/common";
import { DatabaseModule } from "./infrastructure/databases/database.module";
import { RepositoryModule } from "./infrastructure/repositories/repository.module";
import { GamesController } from "./presentation/controllers/games.controller";
import { GuardsModule } from "./presentation/guards/guards.module";

@Module({
  imports: [DatabaseModule, RepositoryModule, GuardsModule],
  controllers: [GamesController],
})
export class AppModule {}
