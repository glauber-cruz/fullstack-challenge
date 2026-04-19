import { Injectable, OnModuleInit } from "@nestjs/common";
import { EventBusService } from "../events/event-bus.service";

@Injectable()
export class GameEngine implements OnModuleInit {
  constructor(private readonly eventBusService: EventBusService) {}

  onModuleInit() {
    this.start();
  }

  start() {
    this.loop();
  }

  private emit(event: string, data?: any) {
    this.eventBusService.emit(event, data);
  }

  private async countdown(seconds: number) {
    for (let i = seconds; i > 0; i--) {
      this.emit("rounds:countdown", { seconds: i });
      await this.wait(1000);
    }
  }

  private async wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async loop() {
    while (true) {
      console.log("Countdown started");
      const tenSeconds = 10;
      await this.countdown(tenSeconds);
      console.log("Countdown finished");
    }
  }
}
