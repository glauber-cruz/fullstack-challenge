import { faker } from "@faker-js/faker";

import { Wallet } from "@/domain/entites/wallets.entity";
import { Amount } from "@/domain/value-object/amount";

type MakeWalletOverrides = {
  id?: string;
  userId?: string;
  balanceInCents?: number;
};

export const makeWallet = (overrides: MakeWalletOverrides = {}) =>
  Wallet.create({
    id: overrides.id ?? faker.string.uuid(),
    userId: overrides.userId ?? faker.string.uuid(),
    balance: Amount.create(overrides.balanceInCents ?? 0),
  });
