import { Module } from "@nestjs/common";
import { GameEngine } from "./game";

@Module({
  providers: [GameEngine],
  exports: [GameEngine],
})
export class EngineModule {}
