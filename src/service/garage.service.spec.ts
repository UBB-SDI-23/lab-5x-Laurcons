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

  describe("if some garages", () => {
    test("then return correctly", async () => {
      prisma.garage.findMany.mockResolvedValueOnce([1, 4, 5, 6, 8, 4, 2].map(count => ({
        id: crypto.randomUUID(),
        name: crypto.randomUUID(),
        location: crypto.randomUUID(),
        _count: { buses: count }
      })));

      const garages = await underTest.biggestGarages();

      expect(garages).toHaveLength(7);
      expect(garages[0]._count.buses).toBe(8);
      expect(garages[1]._count.buses).toBe(6);
    });
  });
});