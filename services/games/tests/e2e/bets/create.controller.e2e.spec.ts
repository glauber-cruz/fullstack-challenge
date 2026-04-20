import {
  INestApplication,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { ClientProxy } from "@nestjs/microservices";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { RoundStatus } from "@/domain/enums/rounds";
import { betsRepositoryToken } from "@/domain/repositories/bets.repository";
import { roundsRepositoryToken } from "@/domain/repositories/rounds.repository";
import { CreateBetUseCase } from "@/application/use-cases/bets/create";
import { EventBusService } from "@/application/events/event-bus.service";
import { GetOrCreateUserService } from "@/application/services/get-or-create-user.service";
import { BetsCreateController } from "@/presentation/controllers/bets/create.controller";
import { AuthGuard } from "@/presentation/guards/auth.guard";
import { makeRound } from "../../factories/round.factory";
import { authGuardMock } from "../../mocks/auth.guard.mock";

const makeCreateBetBody = (overrides: Partial<{ roundId: string; amountInCents: number }> = {}) => ({
  roundId: faker.string.uuid(),
  amountInCents: faker.number.int({ min: 100, max: 100_000 }),
  ...overrides,
});

describe("BetsCreateController (e2e)", () => {
  let app: INestApplication;

  const betsRepositoryMock = {
    create: vi.fn(),
  };

  const roundsRepositoryMock = {
    findById: vi.fn(),
  };

  const getOrCreateUserServiceMock = {
    execute: vi.fn(),
  };

  const eventBusMock = {
    emit: vi.fn(),
  };

  const walletsClientMock: Pick<ClientProxy, "emit"> = {
    emit: vi.fn(),
  };

  const setupSuccessDeps = () => {
    roundsRepositoryMock.findById.mockResolvedValue(
      makeRound({
        id: "round-1",
        status: RoundStatus.PENDING,
        crashMultiplier: 2,
      }),
    );
    getOrCreateUserServiceMock.execute.mockResolvedValue({
      id: "user-1",
      email: "john@doe.com",
      name: "John Doe",
    });
    betsRepositoryMock.create.mockResolvedValue(undefined);
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [BetsCreateController],
      providers: [
        CreateBetUseCase,
        {
          provide: betsRepositoryToken,
          useValue: betsRepositoryMock,
        },
        {
          provide: roundsRepositoryToken,
          useValue: roundsRepositoryMock,
        },
        {
          provide: GetOrCreateUserService,
          useValue: getOrCreateUserServiceMock,
        },
        {
          provide: EventBusService,
          useValue: eventBusMock,
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
    setupSuccessDeps();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create a bet", async () => {
    const roundId = faker.string.uuid();
    roundsRepositoryMock.findById.mockResolvedValueOnce(
      makeRound({
        id: roundId,
        status: RoundStatus.PENDING,
        crashMultiplier: 2,
      }),
    );

    const response = await request(app.getHttpServer())
      .post("/bets")
      .set("Authorization", "Bearer fake-token")
      .send(makeCreateBetBody({ roundId, amountInCents: 500 }));

    expect(response.status).toBe(201);
    expect(response.body.id).toEqual(expect.any(String));
    expect(roundsRepositoryMock.findById).toHaveBeenCalledWith(roundId);
    expect(getOrCreateUserServiceMock.execute).toHaveBeenCalledWith({
      sub: "user-1",
      email: "john@doe.com",
      name: "John Doe",
    });
    expect(betsRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(walletsClientMock.emit).toHaveBeenCalledWith(
      "validate_bet_intent",
      expect.objectContaining({
        userId: "user-1",
        intendedSpendInCents: 500,
        betId: expect.any(String),
      }),
    );
    expect(eventBusMock.emit).toHaveBeenCalledWith(
      "bets:created",
      expect.objectContaining({
        userId: "user-1",
        username: "John Doe",
        status: RoundStatus.PENDING,
        roundId,
        amount: "5",
      }),
    );
  });

  it("should return 400 when amount is lower than 100", async () => {
    const response = await request(app.getHttpServer())
      .post("/bets")
      .set("Authorization", "Bearer fake-token")
      .send(makeCreateBetBody({ amountInCents: 99 }));

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(betsRepositoryMock.create).not.toHaveBeenCalled();
  });

  it("should return 404 when round does not exist", async () => {
    roundsRepositoryMock.findById.mockResolvedValueOnce(null);

    const response = await request(app.getHttpServer())
      .post("/bets")
      .set("Authorization", "Bearer fake-token")
      .send(makeCreateBetBody());

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Round not found");
  });

  it("should return 400 when round is not pending", async () => {
    roundsRepositoryMock.findById.mockResolvedValueOnce(
      makeRound({ status: RoundStatus.RUNNING }),
    );

    const response = await request(app.getHttpServer())
      .post("/bets")
      .set("Authorization", "Bearer fake-token")
      .send(makeCreateBetBody());

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Round is not pending to accept bets");
  });
});
