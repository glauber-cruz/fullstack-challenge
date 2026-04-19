import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from "@nestjs/common";

import type { GetWalletMeResponse } from "@/presentation/dtos/wallet/get-me.dto";
import {
  GetWalletMePresentation,
  GetWalletMeResponseDto,
} from "@/presentation/dtos/wallet/get-me.dto";

import { GetWalletMeQueryBuilder } from "@/infrastructure/query-builders/wallets/get-me";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import type { AuthenticatedRequest } from "@/presentation/guards/auth.guard";
import { AuthGuard } from "@/presentation/guards/auth.guard";

@Controller()
@ApiTags("Wallets")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class GetWalletController {
  constructor(
    private readonly getWalletMeQueryBuilder: GetWalletMeQueryBuilder,
  ) {}

  @Get("me")
  @ApiOkResponse({ type: GetWalletMeResponseDto })
  async handle(@Req() req: AuthenticatedRequest): Promise<GetWalletMeResponse> {
    const wallet = await this.getWalletMeQueryBuilder.execute(req.user.sub);
    if (!wallet) throw new NotFoundException("Wallet not found");
    return GetWalletMePresentation.toHTTP(wallet);
  }
}
