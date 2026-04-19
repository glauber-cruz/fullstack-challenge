import { Module } from "@nestjs/common";
import { RoundsCountdownGateway } from "./rounds/countdown";
import { RoundsRunningGateway } from "./rounds/running";
import { BetsCreatedGateway } from "./bets/created";

@Module({
  providers: [RoundsCountdownGateway, RoundsRunningGateway, BetsCreatedGateway],
  exports: [RoundsCountdownGateway, RoundsRunningGateway, BetsCreatedGateway],
})
export class WebsocketsModule {}
