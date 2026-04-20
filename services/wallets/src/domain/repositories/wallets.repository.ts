import { Wallet } from "../entites/wallets.entity";

export const walletsRepositoryToken = Symbol("WalletsRepository");

export interface WalletsRepository {
  userHasWallet(userId: string): Promise<boolean>;
  findByUserId(userId: string): Promise<Wallet | null>;
  findByIds(ids: string[]): Promise<Wallet[]>;
  create(wallet: Wallet): Promise<void>;
  update(wallet: Wallet): Promise<void>;
  updateMany(wallets: Wallet[]): Promise<void>;
}