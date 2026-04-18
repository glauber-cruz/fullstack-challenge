import { Module } from "@nestjs/common";
import { DatabaseModule } from "./infrastructure/databases/database.module";
import { ControllersModule } from "./presentation/controllers/controllers.module";

@Module({
  imports: [DatabaseModule, ControllersModule],
})
export class AppModule {}
