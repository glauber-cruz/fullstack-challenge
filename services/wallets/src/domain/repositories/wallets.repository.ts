import { Wallet } from "../entites/wallets.entity";

export const walletsRepositoryToken = Symbol("WalletsRepository");

export interface WalletsRepository {
  userHasWallet(userId: string): Promise<boolean>;
  findByUserId(userId: string): Promise<Wallet | null>;
  create(wallet: Wallet): Promise<void>;
}