import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller("rounds")
@ApiTags("Rounds")
export class RoundsGetVerifyByIdController {
  @Get(":id/verify")
  async handle(@Param("id") id: string) {
    return { message: "TODO: implementar verificação da rodada", roundId: id };
  }
}
