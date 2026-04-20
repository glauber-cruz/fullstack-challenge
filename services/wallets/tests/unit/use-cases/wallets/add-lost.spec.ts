import { describe, expect, it, vi } from "vitest";

import type { WalletsRepository } from "@/domain/repositories/wallets.repository";
import { AddLostUseCase } from "@/application/use-cases/wallets/add-lost";
import { makeWallet } from "../../../factories/wallet.factory";

describe("AddLostUseCase", () => {
  const makeWalletsRepositoryMock = (): WalletsRepository => ({
    userHasWallet: vi.fn(),
    findByUserId: vi.fn(),
    findByIds: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  });

  it("should apply lost successfully for one user id", async () => {
    const wallet = makeWallet({ userId: "user-1", balanceInCents: 1000 });
    const walletsRepositoryMock = makeWalletsRepositoryMock();
    vi.mocked(walletsRepositoryMock.findByIds).mockResolvedValue([wallet]);
    vi.mocked(walletsRepositoryMock.updateMany).mockResolvedValue(undefined);

    const sut = new AddLostUseCase(walletsRepositoryMock);

    await sut.execute({
      losts: [{ userId: "user-1", lostInCents: 250 }],
    });

    expect(walletsRepositoryMock.findByIds).toHaveBeenCalledWith(["user-1"]);
    expect(wallet.balance.cents).toBe(750);
    expect(walletsRepositoryMock.updateMany).toHaveBeenCalledWith([wallet]);
  });

  it("should apply lost successfully for multiple user ids", async () => {
    const wallet1 = makeWallet({ userId: "user-1", balanceInCents: 1000 });
    const wallet2 = makeWallet({ userId: "user-2", balanceInCents: 2000 });
    const walletsRepositoryMock = makeWalletsRepositoryMock();
    vi.mocked(walletsRepositoryMock.findByIds).mockResolvedValue([
      wallet1,
      wallet2,
    ]);
    vi.mocked(walletsRepositoryMock.updateMany).mockResolvedValue(undefined);

    const sut = new AddLostUseCase(walletsRepositoryMock);

    await sut.execute({
      losts: [
        { userId: "user-1", lostInCents: 200 },
        { userId: "user-2", lostInCents: 500 },
      ],
    });

    expect(walletsRepositoryMock.findByIds).toHaveBeenCalledWith([
      "user-1",
      "user-2",
    ]);
    expect(wallet1.balance.cents).toBe(800);
    expect(wallet2.balance.cents).toBe(1500);
    expect(walletsRepositoryMock.updateMany).toHaveBeenCalledWith([
      wallet1,
      wallet2,
    ]);
  });

  it("should handle empty input when no ids are provided", async () => {
    const walletsRepositoryMock = makeWalletsRepositoryMock();
    vi.mocked(walletsRepositoryMock.findByIds).mockResolvedValue([]);
    vi.mocked(walletsRepositoryMock.updateMany).mockResolvedValue(undefined);

    const sut = new AddLostUseCase(walletsRepositoryMock);

    await sut.execute({ losts: [] });

    expect(walletsRepositoryMock.findByIds).toHaveBeenCalledWith([]);
    expect(walletsRepositoryMock.updateMany).toHaveBeenCalledWith([]);
  });
});
