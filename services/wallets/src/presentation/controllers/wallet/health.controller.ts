import { Controller, Get } from "@nestjs/common";
import { HealthCheckResponseDto } from "../../dtos/wallet/health-check-response.dto";

@Controller()
export class HealthController {
  @Get("health")
  check(): HealthCheckResponseDto {
    return { status: "ok", service: "wallets" };
  }
}
