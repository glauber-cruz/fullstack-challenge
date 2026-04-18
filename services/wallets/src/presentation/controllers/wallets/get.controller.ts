import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from "@nestjs/common";

import {
  GetWalletMePresentation,
  GetWalletMeResponse,
  GetWalletMeResponseDto,
} from "@/presentation/dtos/wallet/get-me.dto";

import { GetWalletMeQueryBuilder } from "@/infrastructure/query-builders/wallets/get-me";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import {
  AuthenticatedRequest,
  AuthGuard,
} from "@/presentation/guards/auth.guard";

@Controller()
@ApiTags("Wallets")
export class GetWalletController {
  constructor(
    private readonly getWalletMeQueryBuilder: GetWalletMeQueryBuilder,
  ) {}

  @Get("me")
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: GetWalletMeResponseDto })
  async handle(@Req() req: AuthenticatedRequest): Promise<GetWalletMeResponse> {
    const wallet = await this.getWalletMeQueryBuilder.execute(req.user.sub);
    if (!wallet) throw new NotFoundException("Wallet not found");
    return GetWalletMePresentation.toHTTP(wallet);
  }
}
