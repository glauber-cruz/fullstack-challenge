import { Module } from "@nestjs/common";
import { DatabaseModule } from "./infrastructure/databases/database.module";
import { RepositoryModule } from "./infrastructure/repositories/repository.module";
import { ControllersModule } from "./presentation/controllers/controllers.module";

@Module({
  imports: [DatabaseModule, RepositoryModule, ControllersModule],
})
export class AppModule {}
