// @ts-nocheck
// import { describe } from "node:test";
import { TestBed } from "@automock/jest";
import { GarageService } from './garage.service';
import PrismaService from "./prisma.service";
import * as crypto from "crypto";

describe("lines service", () => {
  let underTest: GarageService;
  let prisma: jest.Mocked<PrismaService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(GarageService)
      .mock(PrismaService)
      .using({ garage: { findMany: jest.fn() } })
      .compile();

    underTest = unit;
    prisma = unitRef.get(PrismaService);
  });

  describe("if no garages", () => {
    test("then return nothing", async () => {
      prisma.garage.findMany.mockResolvedValueOnce([]);
      const lines = await underTest.biggestGarages();

      expect(lines).toHaveLength(0);
      expect(prisma.garage.findMany).toBeCalledTimes(1);
    });
  });
});