import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

import { OnModuleInit } from "@nestjs/common";
import { EventBusService } from "../../../application/events/event-bus.service";

@WebSocketGateway({
  cors: { origin: "*" },
})
export class RoundsCountdownGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly eventBus: EventBusService) {}

  onModuleInit() {
    this.registerEvents();
  }

  private registerEvents() {
    this.eventBus.on("rounds:countdown", (data) => {
      this.server.emit("rounds:countdown", data);
    });
  }
}
