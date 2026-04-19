import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


@Controller("rounds")
@ApiTags("Rounds")
export class RoundsGetHistoryController {
  @Get("history")
  async handle() {
    return { message: "TODO: implementar histórico de rodadas", items: [] };
  }
}
