import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { PrismaService } from "@/infrastructure/databases/prisma.service";
import { GetWalletMeQueryBuilder } from "@/infrastructure/query-builders/wallets/get-me";
import { GetWalletController } from "@/presentation/controllers/wallets/get.controller";
import { AuthGuard } from "@/presentation/guards/auth.guard";
import { authGuardMock } from "../../mocks/auth.guard.mock";

describe("GetWalletController (e2e)", () => {
  let app: INestApplication;

  const prismaServiceMock = {
    wallets: {
      findUnique: vi.fn(),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [GetWalletController],
      providers: [
        GetWalletMeQueryBuilder,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuardMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return wallet successfully", async () => {
    prismaServiceMock.wallets.findUnique.mockResolvedValueOnce({
      id: "wallet-1",
      balance: 1234,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    const response = await request(app.getHttpServer())
      .get("/me")
      .set("Authorization", "Bearer fake-token");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe("wallet-1");
    expect(response.body.balance).toBe(12.34);
  });

  it("should return wallet balance in reais and not in cents", async () => {
    prismaServiceMock.wallets.findUnique.mockResolvedValueOnce({
      id: "wallet-1",
      balance: 9999,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    const response = await request(app.getHttpServer())
      .get("/me")
      .set("Authorization", "Bearer fake-token");

    expect(response.status).toBe(200);
    expect(response.body.balance).toBe(99.99);
    expect(response.body.balance).not.toBe(9999);
  });

  it("should fail when wallet is not found", async () => {
    prismaServiceMock.wallets.findUnique.mockResolvedValueOnce(null);

    const response = await request(app.getHttpServer())
      .get("/me")
      .set("Authorization", "Bearer fake-token");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Wallet not found");
  });
});
