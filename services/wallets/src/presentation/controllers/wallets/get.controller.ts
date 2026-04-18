import { Controller, Get, NotFoundException, Req } from "@nestjs/common";
import {
  GetWalletMePresentation,
  GetWalletMeResponse,
} from "@/presentation/dtos/wallet/get-me.dto";

import { GetWalletMeQueryBuilder } from "@/infrastructure/query-builders/wallets/get-me";

@Controller()
export class GetWalletController {
  constructor(
    private readonly getWalletMeQueryBuilder: GetWalletMeQueryBuilder,
  ) {}

  @Get("me")
  async handle(@Req() req: Request): Promise<GetWalletMeResponse> {
    const wallet = await this.getWalletMeQueryBuilder.execute("userId");
    if (!wallet) throw new NotFoundException("Wallet not found");
    return GetWalletMePresentation.toHTTP(wallet);
  }
}
