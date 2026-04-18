import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import type { HealthCheckResponse } from "@/presentation/dtos/wallet/health-check-response.dto";
import {
  HealthCheckPresentation,
  HealthCheckResponseDto,
} from "@/presentation/dtos/wallet/health-check-response.dto";

@Controller()
@ApiTags("Health")
export class HealthController {
  @Get("health")
  @ApiOkResponse({ type: HealthCheckResponseDto })
  handle(): HealthCheckResponse {
    return HealthCheckPresentation.toHTTP();
  }
}
