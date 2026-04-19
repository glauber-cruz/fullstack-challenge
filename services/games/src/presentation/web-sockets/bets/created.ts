import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

import { OnModuleInit } from "@nestjs/common";
import { EventBusService } from "../../../application/events/event-bus.service";

@WebSocketGateway({
  cors: { origin: "*" },
})
export class BetsCreatedGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly eventBus: EventBusService) {}

  onModuleInit() {
    this.registerEvents();
  }

  private registerEvents() {
    this.eventBus.on("bets:created", (data) => {
      this.server.emit("bets:created", data);
    });
  }
}
