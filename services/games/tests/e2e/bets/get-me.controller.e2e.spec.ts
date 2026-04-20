import {
  INestApplication,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
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

import { GetBetsMeQueryHandler } from "@/infrastructure/query-handler/bets/get-me";
import { PrismaService } from "@/infrastructure/databases/prisma.service";
import { BetsGetMeController } from "@/presentation/controllers/bets/get-me.controller";
import { AuthGuard } from "@/presentation/guards/auth.guard";
import { authGuardMock } from "../../mocks/auth.guard.mock";

type BetListItem = {
  id: string;
  roundId: string;
  amount: number;
  cashoutMultiplier: number | null;
  cashedOutAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const makeBet = (overrides: Partial<BetListItem> = {}): BetListItem => {
  const createdAt = faker.date.recent().toISOString();

  return {
    id: faker.string.uuid(),
    roundId: faker.string.uuid(),
    amount: faker.number.int({ min: 100, max: 5000 }),
    cashoutMultiplier: null,
    cashedOutAt: null,
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  };
};

describe("BetsGetMeController (e2e)", () => {
  let app: INestApplication;

  const prismaServiceMock = {
    bets: {
      findMany: vi.fn(),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [BetsGetMeController],
      providers: [
        GetBetsMeQueryHandler,
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

  it("should return empty list when no bets are found", async () => {
    prismaServiceMock.bets.findMany.mockResolvedValueOnce([]);

    const response = await request(app.getHttpServer())
      .get("/bets/me")
      .set("Authorization", "Bearer fake-token")
      .query({ limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      items: [],
      nextCursor: null,
      limit: 10,
    });
    expect(prismaServiceMock.bets.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      take: 11,
      skip: 0,
      cursor: undefined,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
  });

  it("should return bets when bets are found", async () => {
    prismaServiceMock.bets.findMany.mockResolvedValueOnce([
      makeBet({ id: "bet-1" }),
      makeBet({ id: "bet-2" }),
    ]);

    const response = await request(app.getHttpServer())
      .get("/bets/me")
      .set("Authorization", "Bearer fake-token")
      .query({ limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(2);
    expect(response.body.items[0].id).toBe("bet-1");
    expect(response.body.items[1].id).toBe("bet-2");
    expect(response.body.limit).toBe(10);
    expect(response.body.nextCursor).toBeNull();
  });

  it("should paginate 3 bets with limit 1 using cursor", async () => {
    const expectedPages = [
      { id: "bet-3", nextCursor: "bet-2" },
      { id: "bet-2", nextCursor: "bet-1" },
      { id: "bet-1", nextCursor: null },
    ] as const;

    prismaServiceMock.bets.findMany.mockResolvedValueOnce([
      makeBet({ id: "bet-3" }),
      makeBet({ id: "bet-2" }),
    ]);
    prismaServiceMock.bets.findMany.mockResolvedValueOnce([
      makeBet({ id: "bet-2" }),
      makeBet({ id: "bet-1" }),
    ]);
    prismaServiceMock.bets.findMany.mockResolvedValueOnce([makeBet({ id: "bet-1" })]);

    const pages: Array<{ status: number; body: any }> = [];
    let nextCursor: string | null | undefined;

    for (const _ of expectedPages) {
      const query: { limit: number; nextCursor?: string } = { limit: 1 };
      if (nextCursor) query.nextCursor = nextCursor;

      const response = await request(app.getHttpServer())
        .get("/bets/me")
        .set("Authorization", "Bearer fake-token")
        .query(query);

      pages.push(response);
      nextCursor = response.body.nextCursor;
    }

    for (const [index, expectedPage] of expectedPages.entries()) {
      expect(pages[index].status).toBe(200);
      expect(pages[index].body.items[0].id).toBe(expectedPage.id);
      expect(pages[index].body.nextCursor).toBe(expectedPage.nextCursor);
    }

    expect(prismaServiceMock.bets.findMany).toHaveBeenNthCalledWith(1, {
      where: { userId: "user-1" },
      take: 2,
      skip: 0,
      cursor: undefined,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
    expect(prismaServiceMock.bets.findMany).toHaveBeenNthCalledWith(2, {
      where: { userId: "user-1" },
      take: 2,
      skip: 1,
      cursor: { id: "bet-2" },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
    expect(prismaServiceMock.bets.findMany).toHaveBeenNthCalledWith(3, {
      where: { userId: "user-1" },
      take: 2,
      skip: 1,
      cursor: { id: "bet-1" },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
  });
});
