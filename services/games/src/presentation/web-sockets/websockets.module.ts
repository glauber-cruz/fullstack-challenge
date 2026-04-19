import { Module } from "@nestjs/common";
import { RoundsCountdownGateway } from "./rounds/countdown";
import { RoundsRunningGateway } from "./rounds/running";

@Module({
  providers: [RoundsCountdownGateway, RoundsRunningGateway],
  exports: [RoundsCountdownGateway, RoundsRunningGateway],
})
export class WebsocketsModule {}
