// @ts-nocheck
// import { describe } from "node:test";
import { TestBed } from "@automock/jest";
import { LineService } from './line.service';
import PrismaService from "./prisma.service";

// jest.mock('./prisma.service');

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
      prisma.line.findMany.mockRejectedValueOnce([]);
      const lines = await underTest.longestLines();
      console.log({ lines });

      // expect(lines).toHaveLength(0);
      // expect(prisma.line.findMany).toBeCalledTimes(1);
    });
  });
});