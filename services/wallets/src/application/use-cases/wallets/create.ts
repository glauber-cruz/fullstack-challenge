import { Wallet } from "@/domain/entites/wallets.entity";

import type { WalletsRepository } from "@/domain/repositories/wallets.repository";
import { walletsRepositoryToken } from "@/domain/repositories/wallets.repository";

import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { KeycloakUser } from "@/infrastructure/types/keycloack";

import { GetOrCreateUserService } from "@/application/services/get-or-create-user.service";

@Injectable()
export class CreateWalletUseCase {
  constructor(
    @Inject(walletsRepositoryToken)
    private readonly walletsRepository: WalletsRepository,
    private readonly getOrCreateUserService: GetOrCreateUserService,
  ) {}

  async execute(input: KeycloakUser) {
    const user = await this.getOrCreateUserService.execute(input);
    const userHasWallet = await this.walletsRepository.userHasWallet(user.id);

    if (userHasWallet) throw new ConflictException("User already has a wallet");
    const wallet = Wallet.create({ userId: user.id });
    
    await this.walletsRepository.create(wallet);
  }
}
