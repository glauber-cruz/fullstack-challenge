import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { walletsRepositoryToken } from "@/domain/repositories/wallets.repository";
import { CreateWalletUseCase } from "@/application/use-cases/wallets/create";
import { GetOrCreateUserService } from "@/application/services/get-or-create-user.service";
import { CreateWalletController } from "@/presentation/controllers/wallets/create.controller";
import { AuthGuard } from "@/presentation/guards/auth.guard";
import { authGuardMock } from "../../mocks/auth.guard.mock";

describe("CreateWalletController (e2e)", () => {
  let app: INestApplication;

  const walletsRepositoryMock = {
    userHasWallet: vi.fn(),
    create: vi.fn(),
  };

  const getOrCreateUserServiceMock = {
    execute: vi.fn(),
  };

  const setupSuccessDeps = () => {
    getOrCreateUserServiceMock.execute.mockResolvedValue({
      id: "user-1",
      email: "john@doe.com",
      name: "John Doe",
    });
    walletsRepositoryMock.userHasWallet.mockResolvedValue(false);
    walletsRepositoryMock.create.mockResolvedValue(undefined);
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CreateWalletController],
      providers: [
        CreateWalletUseCase,
        {
          provide: walletsRepositoryToken,
          useValue: walletsRepositoryMock,
        },
        {
          provide: GetOrCreateUserService,
          useValue: getOrCreateUserServiceMock,
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
    setupSuccessDeps();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create wallet successfully", async () => {
    const response = await request(app.getHttpServer())
      .post("/")
      .set("Authorization", "Bearer fake-token");

    expect(response.status).toBe(201);
    expect(getOrCreateUserServiceMock.execute).toHaveBeenCalledWith({
      sub: "user-1",
      email: "john@doe.com",
      name: "John Doe",
    });
    expect(walletsRepositoryMock.userHasWallet).toHaveBeenCalledWith("user-1");
    expect(walletsRepositoryMock.create).toHaveBeenCalledTimes(1);
  });

  it("should fail when user already has wallet", async () => {
    walletsRepositoryMock.userHasWallet.mockResolvedValueOnce(true);

    const response = await request(app.getHttpServer())
      .post("/")
      .set("Authorization", "Bearer fake-token");

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("User already has a wallet");
    expect(walletsRepositoryMock.create).not.toHaveBeenCalled();
  });
});
