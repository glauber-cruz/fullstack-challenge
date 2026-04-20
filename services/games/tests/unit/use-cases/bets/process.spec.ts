import { BadRequestException, NotFoundException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";

import { BetProcessingStatus } from "@/domain/enums/bet";
import type { BetsRepository } from "@/domain/repositories/bets.repository";
import { ProcessBetUseCase } from "@/application/use-cases/bets/process";
import { makeBet } from "../../../factories/bet.factory";

// Coloquei esse aqui só por que ele não é coberto no e2e.

describe("ProcessBetUseCase", () => {
  const makeBetsRepositoryMock = (): BetsRepository => ({
    findById: vi.fn(),
    findNotCashoutByRoundId: vi.fn(),
    findByUserAndRound: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  });

  it("should process bet successfully when isValid is true", async () => {
    const bet = makeBet({ processingStatus: BetProcessingStatus.PROCESSING });
    const betsRepositoryMock = makeBetsRepositoryMock();
    vi.mocked(betsRepositoryMock.findById).mockResolvedValue(bet);
    vi.mocked(betsRepositoryMock.update).mockResolvedValue(bet);

    const sut = new ProcessBetUseCase(betsRepositoryMock);

    await sut.execute({ betId: bet.id, isValid: true });

    expect(betsRepositoryMock.findById).toHaveBeenCalledWith(bet.id);
    expect(bet.processingStatus).toBe(BetProcessingStatus.COMPLETED);
    expect(betsRepositoryMock.update).toHaveBeenCalledWith(bet);
  });

  it("should process bet successfully when isValid is false", async () => {
    const bet = makeBet({ processingStatus: BetProcessingStatus.PROCESSING });
    const betsRepositoryMock = makeBetsRepositoryMock();
    vi.mocked(betsRepositoryMock.findById).mockResolvedValue(bet);
    vi.mocked(betsRepositoryMock.update).mockResolvedValue(bet);

    const sut = new ProcessBetUseCase(betsRepositoryMock);

    await sut.execute({ betId: bet.id, isValid: false });

    expect(betsRepositoryMock.findById).toHaveBeenCalledWith(bet.id);
    expect(bet.processingStatus).toBe(BetProcessingStatus.FAILED);
    expect(betsRepositoryMock.update).toHaveBeenCalledWith(bet);
  });

  it("should throw when bet is not found", async () => {
    const betsRepositoryMock = makeBetsRepositoryMock();
    vi.mocked(betsRepositoryMock.findById).mockResolvedValue(null);

    const sut = new ProcessBetUseCase(betsRepositoryMock);
    const execution = sut.execute({ betId: "missing-bet", isValid: true });

    await expect(execution).rejects.toThrow(NotFoundException);
    await expect(execution).rejects.toThrow("Bet not found");
    expect(betsRepositoryMock.update).not.toHaveBeenCalled();
  });

  it("should throw when bet is already processed", async () => {
    const bet = makeBet({ processingStatus: BetProcessingStatus.COMPLETED });
    const betsRepositoryMock = makeBetsRepositoryMock();
    vi.mocked(betsRepositoryMock.findById).mockResolvedValue(bet);

    const sut = new ProcessBetUseCase(betsRepositoryMock);
    const execution = sut.execute({ betId: bet.id, isValid: true });

    await expect(execution).rejects.toThrow(BadRequestException);
    await expect(execution).rejects.toThrow("Bet is already processed");
    expect(betsRepositoryMock.update).not.toHaveBeenCalled();
  });
});
