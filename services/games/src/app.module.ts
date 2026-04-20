import { Module } from "@nestjs/common";
import { DatabaseModule } from "./infrastructure/databases/database.module";

import { RepositoryModule } from "./infrastructure/repositories/repository.module";
import { ControllersModule } from "./presentation/controllers/controllers.module";

import { WebsocketsModule } from "./presentation/web-sockets/websockets.module";
import { EngineModule } from "./application/engine/engine.module";

import { EventsModule } from "./application/events/events.module";
import { MessagesModule } from "./presentation/messages/messages.module";

import { CacheModule } from "./infrastructure/cache/cache.module";

@Module({
  imports: [
    DatabaseModule,
    RepositoryModule,
    ControllersModule,
    WebsocketsModule,
    EngineModule,
    EventsModule,
    MessagesModule,
    CacheModule,
  ],
})
export class AppModule {}
