import { NotFoundException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";

import type { WalletsRepository } from "@/domain/repositories/wallets.repository";
import { AddGainUseCase } from "@/application/use-cases/wallets/add-gain";
import { makeWallet } from "../../../factories/wallet.factory";

describe("AddGainUseCase", () => {
  const makeWalletsRepositoryMock = (): WalletsRepository => ({
    userHasWallet: vi.fn(),
    findByUserId: vi.fn(),
    findByIds: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  });

  it("should add gain successfully", async () => {
    const wallet = makeWallet({ userId: "user-1", balanceInCents: 1000 });
    const walletsRepositoryMock = makeWalletsRepositoryMock();
    vi.mocked(walletsRepositoryMock.findByUserId).mockResolvedValue(wallet);
    vi.mocked(walletsRepositoryMock.update).mockResolvedValue(undefined);

    const sut = new AddGainUseCase(walletsRepositoryMock);

    await sut.execute({ userId: "user-1", gainInCents: 500 });

    expect(walletsRepositoryMock.findByUserId).toHaveBeenCalledWith("user-1");
    expect(wallet.balance.cents).toBe(1500);
    expect(walletsRepositoryMock.update).toHaveBeenCalledWith(wallet);
  });

  it("should throw when wallet is not found", async () => {
    const walletsRepositoryMock = makeWalletsRepositoryMock();
    vi.mocked(walletsRepositoryMock.findByUserId).mockResolvedValue(null);

    const sut = new AddGainUseCase(walletsRepositoryMock);
    const execution = sut.execute({ userId: "missing-user", gainInCents: 500 });

    await expect(execution).rejects.toThrow(NotFoundException);
    await expect(execution).rejects.toThrow("Wallet not found");
    expect(walletsRepositoryMock.update).not.toHaveBeenCalled();
  });
});
