import { Controller, Post } from "@nestjs/common";
import { HealthCheckResponseDto } from "../../dtos/wallet/health-check-response.dto";



@Controller()
export class CreateWalletController {
  @Post("")
  handle(): HealthCheckResponseDto {
    return { status: "ok", service: "wallets" };
  }
}
