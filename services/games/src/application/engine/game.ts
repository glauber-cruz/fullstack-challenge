import { Injectable, OnModuleInit } from "@nestjs/common";
import { EventBusService } from "../events/event-bus.service";

import { CreateRoundUseCase } from "../use-cases/rounds/create";
import { RunRoundUseCase } from "../use-cases/rounds/run";

@Injectable()
export class GameEngine implements OnModuleInit {
  constructor(
    private readonly eventBusService: EventBusService,
    private readonly createRoundUseCase: CreateRoundUseCase,
    private readonly runRoundUseCase: RunRoundUseCase,
  ) {}

  private readonly countdownSeconds = 10;

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
    for (let i = seconds; i >= 0; i--) {
      this.emit("rounds:countdown", { seconds: i });
      await this.wait(1000);
    }
  }

  private async wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async loop() {
    while (true) {
      const { roundId, crashMultiplier } = await this.prepareRound();
      await this.countdown(this.countdownSeconds);
      await this.runRound(roundId, crashMultiplier);
    }
  }

  private async prepareRound() {
    const crashMultiplier = this.calculateCrashMultiplier();
    const roundId = await this.createRoundUseCase.execute({ crashMultiplier });
    return { roundId, crashMultiplier };
  }

  private calculateCrashMultiplier() {
    const houseEdge = 0.01;
    const r = Math.random();

    const crash = (1 / (1 - r)) * (1 - houseEdge);
    return Math.min(100, Math.max(1, Number(crash.toFixed(2))));
  }

  private async runRound(roundId: string, crashMultiplier: number) {
    await this.runRoundUseCase.execute(roundId);
    await this.runRunning(roundId, crashMultiplier);
  }

  private async runRunning(roundId: string, crashMultiplier: number) {
    let multiplier = 1;

    const interval = 100;
    const growthRate = 0.015;

    while (multiplier < crashMultiplier) {
      await this.wait(interval);

      multiplier *= 1 + growthRate;

      this.emit("rounds:running", {
        roundId,
        multiplier: this.formatMultiplier(multiplier),
      });
    }
  }

  private formatMultiplier(value: number) {
    return Number(value.toFixed(2));
  }
}
