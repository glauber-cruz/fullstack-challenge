import {
  INestApplication,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { ClientProxy } from "@nestjs/microservices";
import request from "supertest";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { BetProcessingStatus, BetStatus } from "@/domain/enums/bet";
import { RoundStatus } from "@/domain/enums/rounds";
import { betsRepositoryToken } from "@/domain/repositories/bets.repository";
import { roundsRepositoryToken } from "@/domain/repositories/rounds.repository";
import { CashoutBetUseCase } from "@/application/use-cases/bets/cashout";
import { RedisService } from "@/infrastructure/cache/redis.service";
import { BetsCashoutController } from "@/presentation/controllers/bets/cashout.controller";
import { AuthGuard } from "@/presentation/guards/auth.guard";
import { makeBet } from "../../factories/bet.factory";
import { makeRound } from "../../factories/round.factory";
import { authGuardMock } from "../../mocks/auth.guard.mock";

const makeCashoutBody = (overrides: Partial<{ betId: string }> = {}) => ({
  betId: faker.string.uuid(),
  ...overrides,
});

describe("BetsCashoutController (e2e)", () => {
  let app: INestApplication;

  const betsRepositoryMock = {
    findById: vi.fn(),
    update: vi.fn(),
  };

  const roundsRepositoryMock = {
    findById: vi.fn(),
  };

  const redisClientMock = {
    get: vi.fn(),
  };

  const redisServiceMock = {
    getClient: vi.fn(() => redisClientMock),
  };

  const walletsClientMock: Pick<ClientProxy, "emit"> = {
    emit: vi.fn(),
  };

  const setupSuccessDeps = () => {
    betsRepositoryMock.findById.mockResolvedValue(
      makeBet({ id: "bet-1", roundId: "round-1" }),
    );
    roundsRepositoryMock.findById.mockResolvedValue(
      makeRound({
        id: "round-1",
        status: RoundStatus.RUNNING,
        crashMultiplier: 3.5,
      }),
    );
    redisClientMock.get.mockResolvedValue("2.5");
    betsRepositoryMock.update.mockImplementation(async (bet: unknown) => bet);
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [BetsCashoutController],
      providers: [
        CashoutBetUseCase,
        {
          provide: betsRepositoryToken,
          useValue: betsRepositoryMock,
        },
        {
          provide: roundsRepositoryToken,
          useValue: roundsRepositoryMock,
        },
        {
          provide: RedisService,
          useValue: redisServiceMock,
        },
        {
          provide: "WALLETS_RMQ_CLIENT",
          useValue: walletsClientMock,
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
    redisServiceMock.getClient = vi.fn(() => redisClientMock);
    setupSuccessDeps();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should cashout successfully", async () => {
    const response = await request(app.getHttpServer())
      .post("/bets/cashout")
      .set("Authorization", "Bearer fake-token")
      .send(makeCashoutBody({ betId: "bet-1" }));

    expect(response.status).toBe(201);
    expect(betsRepositoryMock.findById).toHaveBeenCalledWith("bet-1");
    expect(roundsRepositoryMock.findById).toHaveBeenCalledWith("round-1");
    expect(redisClientMock.get).toHaveBeenCalledWith("round:round-1:multiplier");
    expect(walletsClientMock.emit).toHaveBeenCalledWith("add_gain", {
      userId: "user-1",
      gainInCents: 2500,
    });
    expect(betsRepositoryMock.update).toHaveBeenCalledTimes(1);
  });

  it("should fail when bet does not exist", async () => {
    betsRepositoryMock.findById.mockResolvedValueOnce(null);

    const response = await request(app.getHttpServer())
      .post("/bets/cashout")
      .set("Authorization", "Bearer fake-token")
      .send(makeCashoutBody());

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Bet not found");
  });

  it("should fail when bet was already cashed out", async () => {
    betsRepositoryMock.findById.mockResolvedValueOnce(
      makeBet({
        cashedOutAt: new Date(),
      }),
    );

    const response = await request(app.getHttpServer())
      .post("/bets/cashout")
      .set("Authorization", "Bearer fake-token")
      .send(makeCashoutBody());

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Bet already cashed out");
  });

  it("should fail when bet processing is not completed", async () => {
    betsRepositoryMock.findById.mockResolvedValueOnce(
      makeBet({
        processingStatus: BetProcessingStatus.PROCESSING,
      }),
    );

    const response = await request(app.getHttpServer())
      .post("/bets/cashout")
      .set("Authorization", "Bearer fake-token")
      .send(makeCashoutBody());

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Bet is not completed to cashout");
  });

  it("should fail when bet status is not pending", async () => {
    betsRepositoryMock.findById.mockResolvedValueOnce(
      makeBet({
        status: BetStatus.LOST,
      }),
    );

    const response = await request(app.getHttpServer())
      .post("/bets/cashout")
      .set("Authorization", "Bearer fake-token")
      .send(makeCashoutBody());

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Bet is not pending to cashout");
  });

  it("should fail when round is not found", async () => {
    roundsRepositoryMock.findById.mockResolvedValueOnce(null);

    const response = await request(app.getHttpServer())
      .post("/bets/cashout")
      .set("Authorization", "Bearer fake-token")
      .send(makeCashoutBody());

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Round not found");
  });

  it("should fail when round has no crash multiplier", async () => {
    roundsRepositoryMock.findById.mockResolvedValueOnce(
      makeRound({
        crashMultiplier: 0,
      }),
    );

    const response = await request(app.getHttpServer())
      .post("/bets/cashout")
      .set("Authorization", "Bearer fake-token")
      .send(makeCashoutBody());

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });

  it("should fail when current multiplier is undefined", async () => {
    redisClientMock.get.mockResolvedValueOnce(undefined);

    const response = await request(app.getHttpServer())
      .post("/bets/cashout")
      .set("Authorization", "Bearer fake-token")
      .send(makeCashoutBody());

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });

  it("should fail when current multiplier is NaN", async () => {
    redisClientMock.get.mockResolvedValueOnce("abc");

    const response = await request(app.getHttpServer())
      .post("/bets/cashout")
      .set("Authorization", "Bearer fake-token")
      .send(makeCashoutBody());

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });
});
