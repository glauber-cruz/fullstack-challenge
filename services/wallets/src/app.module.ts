import { Module } from "@nestjs/common";
import { DatabaseModule } from "./infrastructure/databases/database.module";

import { ControllersModule } from "./presentation/controllers/controllers.module";
import { MessagesModule } from "./presentation/messages/messages.module";

@Module({
  imports: [DatabaseModule, ControllersModule, MessagesModule],
})
export class AppModule {}
