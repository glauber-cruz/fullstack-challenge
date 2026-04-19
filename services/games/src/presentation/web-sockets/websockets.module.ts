import { Module } from "@nestjs/common";
import { RoundsCountdownGateway } from "./rounds/countdown";

@Module({
  providers: [RoundsCountdownGateway],
  exports: [RoundsCountdownGateway],
})
export class WebsocketsModule {}
