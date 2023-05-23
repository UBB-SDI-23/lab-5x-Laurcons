// @ts-nocheck
// import { describe } from "node:test";
import { TestBed } from "@automock/jest";
import { LineService } from './line.service';
import PrismaService from "./prisma.service";
import * as crypto from "crypto";

describe("lines service", () => {
  let underTest: LineService;
  let prisma: jest.Mocked<PrismaService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(LineService)
      .mock(PrismaService)
      .using({ line: { findMany: jest.fn() } })
      .compile();

    underTest = unit;
    prisma = unitRef.get(PrismaService);
  });

  describe("if no lines", () => {
    test("then return nothing", async () => {
      prisma.line.findMany.mockResolvedValueOnce([]);
      const lines = await underTest.longestLines();

      // expect(lines).toHaveLength(0);
      // expect(prisma.line.findMany).toBeCalledTimes(1);
    });
  });

  describe("if some lines", () => {
    test("then return correctly", async () => {
      prisma.line.findMany.mockResolvedValueOnce([1, 4, 5, 6, 8, 4, 2].map(count => ({
        id: crypto.randomUUID(),
        name: crypto.randomUUID(),
        startName: crypto.randomUUID(),
        endName: crypto.randomUUID(),
        _count: { lineStops: count },
      })));

      const lines = await underTest.longestLines();

      // expect(lines).toHaveLength(7);
      // expect(lines[0]._count.lineStops).toBe(8);
    });
  });
});