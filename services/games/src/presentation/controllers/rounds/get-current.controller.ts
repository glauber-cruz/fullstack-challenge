import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller("rounds")
@ApiTags("Rounds")
export class RoundsGetCurrentController {
  @Get("current")
  async handle() {
    return { message: "TODO: implementar rodada atual" };
  }
}
