import { NotFoundException } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { describe, expect, it, vi } from "vitest";

import type { WalletsRepository } from "@/domain/repositories/wallets.repository";
import { HasEnoughBalanceUseCase } from "@/application/use-cases/wallets/has-enough-balance";
import { makeWallet } from "../../../factories/wallet.factory";

describe("HasEnoughBalanceUseCase", () => {
  const makeWalletsRepositoryMock = (): WalletsRepository => ({
    userHasWallet: vi.fn(),
    findByUserId: vi.fn(),
    findByIds: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  });

  it("should process successfully and emit process_bet", async () => {
    const wallet = makeWallet({ userId: "user-1", balanceInCents: 1000 });
    const walletsRepositoryMock = makeWalletsRepositoryMock();
    vi.mocked(walletsRepositoryMock.findByUserId).mockResolvedValue(wallet);

    const gamesClientMock: Pick<ClientProxy, "emit"> = {
      emit: vi.fn(),
    };

    const sut = new HasEnoughBalanceUseCase(
      walletsRepositoryMock,
      gamesClientMock as ClientProxy,
    );

    await sut.execute({
      userId: "user-1",
      intendedSpendInCents: 500,
      betId: "bet-1",
    });

    expect(walletsRepositoryMock.findByUserId).toHaveBeenCalledWith("user-1");
    expect(gamesClientMock.emit).toHaveBeenCalledWith("process_bet", {
      betId: "bet-1",
      isValid: true,
    });
  });

  it("should throw when wallet is not found", async () => {
    const walletsRepositoryMock = makeWalletsRepositoryMock();
    vi.mocked(walletsRepositoryMock.findByUserId).mockResolvedValue(null);

    const gamesClientMock: Pick<ClientProxy, "emit"> = {
      emit: vi.fn(),
    };

    const sut = new HasEnoughBalanceUseCase(
      walletsRepositoryMock,
      gamesClientMock as ClientProxy,
    );
    const execution = sut.execute({
      userId: "missing-user",
      intendedSpendInCents: 500,
      betId: "bet-1",
    });

    await expect(execution).rejects.toThrow(NotFoundException);
    await expect(execution).rejects.toThrow("Wallet not found");
    expect(gamesClientMock.emit).not.toHaveBeenCalled();
  });
});
