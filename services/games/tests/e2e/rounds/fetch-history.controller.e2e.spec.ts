import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { RoundStatus } from "@/domain/enums/rounds";
import { PrismaService } from "@/infrastructure/databases/prisma.service";
import { FetchRoundsHistoryQueryHandler } from "@/infrastructure/query-handler/rounds/fetch-history";
import { RoundsFetchHistoryController } from "@/presentation/controllers/rounds/fetch-history.controller";

type RoundHistoryItem = {
  id: string;
  status: RoundStatus;
  startAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const makeRound = (
  overrides: Partial<RoundHistoryItem> = {},
): RoundHistoryItem => {
  const createdAt = faker.date.recent().toISOString();

  return {
    id: faker.string.uuid(),
    status: RoundStatus.CRASHED,
    startAt: createdAt,
    endedAt: createdAt,
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  };
};

describe("RoundsFetchHistoryController (e2e)", () => {
  let app: INestApplication;

  const prismaServiceMock = {
    rounds: {
      findMany: vi.fn(),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RoundsFetchHistoryController],
      providers: [
        FetchRoundsHistoryQueryHandler,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return empty list when no rounds are found", async () => {
    prismaServiceMock.rounds.findMany.mockResolvedValueOnce([]);

    const response = await request(app.getHttpServer())
      .get("/rounds/history")
      .query({ limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      items: [],
      nextCursor: null,
      limit: "10",
    });
  });

  it("should return rounds when rounds are found", async () => {
    prismaServiceMock.rounds.findMany.mockResolvedValueOnce([
      makeRound({ id: "round-1" }),
      makeRound({ id: "round-2" }),
    ]);

    const response = await request(app.getHttpServer())
      .get("/rounds/history")
      .query({ limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(2);
    expect(response.body.items[0].id).toBe("round-1");
    expect(response.body.items[1].id).toBe("round-2");
    expect(response.body.nextCursor).toBeNull();
    expect(response.body.limit).toBe("10");
  });

  it("should paginate 3 rounds with limit 1 using cursor", async () => {
    const expectedPages = [
      { id: "round-3", nextCursor: "round-2" },
      { id: "round-2", nextCursor: "round-1" },
      { id: "round-1", nextCursor: null },
    ] as const;

    prismaServiceMock.rounds.findMany.mockResolvedValueOnce([
      makeRound({ id: "round-3" }),
      makeRound({ id: "round-2" }),
    ]);
    prismaServiceMock.rounds.findMany.mockResolvedValueOnce([
      makeRound({ id: "round-2" }),
      makeRound({ id: "round-1" }),
    ]);
    prismaServiceMock.rounds.findMany.mockResolvedValueOnce([
      makeRound({ id: "round-1" }),
    ]);

    const pages: Array<{ status: number; body: any }> = [];
    let nextCursor: string | null | undefined;

    for (const _ of expectedPages) {
      const query: { limit: number; nextCursor?: string } = { limit: 1 };
      if (nextCursor) query.nextCursor = nextCursor;

      const response = await request(app.getHttpServer())
        .get("/rounds/history")
        .query(query);

      pages.push(response);
      nextCursor = response.body.nextCursor;
    }

    for (const [index, expectedPage] of expectedPages.entries()) {
      expect(pages[index].status).toBe(200);
      expect(pages[index].body.items[0].id).toBe(expectedPage.id);
      expect(pages[index].body.nextCursor).toBe(expectedPage.nextCursor);
    }
  });
});
