import { Wallet } from "../entites/wallets.entity";

export const walletsRepositoryToken = Symbol("WalletsRepository");

export interface WalletsRepository {
  userHasWallet(userId: string): Promise<boolean>;
  create(wallet: Wallet): Promise<void>;
}