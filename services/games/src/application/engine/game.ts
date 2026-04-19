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

  private readonly countdownSeconds = 60;

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
      const roundId = await this.prepareRound();
      await this.countdown(this.countdownSeconds);
      await this.startRound(roundId);
    }
  }

  private async prepareRound() {
    const crashMultiplier = this.calculateCrashMultiplier();
    const roundId = await this.createRoundUseCase.execute({ crashMultiplier });
    return roundId;
  }

  private calculateCrashMultiplier() {
    const houseEdge = 0.01;
    const r = Math.random();

    const crash = (1 / (1 - r)) * (1 - houseEdge);
    return Math.min(100, Math.max(1, Number(crash.toFixed(2))));
  }

  private async startRound(roundId: string) {
    await this.runRoundUseCase.execute(roundId);
  }
}
