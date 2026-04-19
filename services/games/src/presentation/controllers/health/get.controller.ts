import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { HealthCheckResponseDto } from "../../dtos/health-check-response.dto";

@Controller()
@ApiTags("Health")
export class GamesController {
  @Get("health")
  check(): HealthCheckResponseDto {
    return { status: "ok", service: "games" };
  }
}
