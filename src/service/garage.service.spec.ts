// @ts-nocheck
// import { describe } from "node:test";
import { TestBed } from '@automock/jest';
import { Test } from '@nestjs/testing';
import { GarageService } from './garage.service';
import AuthService from './auth.service';
import PrismaService from './prisma.service';
import * as crypto from 'crypto';
import { INestApplication } from '@nestjs/common';
import { PaginationQuery } from '../lib/pipe/pagination-query.pipe';
import { Garage } from '@prisma/client';
import { AppModule } from '../app.module';
import * as request from 'supertest';
import { NextFunction, Request } from 'express';

describe('garage service', () => {
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

  describe('if no garages', () => {
    test('then return nothing', async () => {
      prisma.garage.findMany.mockResolvedValueOnce([]);
      // const lines = await underTest.biggestGarages();

      // expect(lines).toHaveLength(0);
      // expect(prisma.garage.findMany).toBeCalledTimes(1);
    });
  });

  describe('if some garages', () => {
    test('then return correctly', async () => {
      prisma.garage.findMany.mockResolvedValueOnce(
        [1, 4, 5, 6, 8, 4, 2].map((count) => ({
          id: crypto.randomUUID(),
          name: crypto.randomUUID(),
          location: crypto.randomUUID(),
          _count: { buses: count },
        })),
      );

      // const garages = await underTest.biggestGarages();

      // expect(garages).toHaveLength(7);
      // expect(garages[0]._count.buses).toBe(8);
      // expect(garages[1]._count.buses).toBe(6);
    });
  });
});

describe('garage e2e', () => {
  const getGarageAtIdx = (idx: number, idx2?: number) => {
    if (idx2 !== undefined) idx = idx2; // ignore first param
    return {
      id: idx,
      name: 'garage ' + idx,
      capacity: 135 * idx,
      location: 'location ' + idx,
      ownerId: parseInt(idx / 10),
    };
  };
  let app: INestApplication;
  let garageService = {
    findAll({ skip, take }: PaginationQuery) {
      const list: Garage[] = [...Array(10).fill().map(getGarageAtIdx)];
      return {
        data: list.slice(skip, skip + take),
        total: 10,
      };
    },
    findOne(id: number) {
      return this.updates?.[id] ?? getGarageAtIdx(id);
    },
    updateOne(id: number, updates: any) {
      const garage = Object.assign({}, this.findOne(id), updates);
      this.updates = this.updates ?? [];
      this.updates[id] = garage;
    },
  };
  let authService = {
    verifyToken(token: string) {
      return token === 'valid' ? { id: 1, role: 'regular' } : null;
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GarageService)
      .useValue(garageService)
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleRef.createNestApplication();
    app.use((req: Request, res, next: NextFunction) => {
      req.headers['authorization'] = 'Bearer valid';
      next();
    });
    await app.init();
  });

  it('get garages paginated 1', () => {
    return request(app.getHttpServer())
      .get('/garage?take=1&skip=0')
      .expect(200)
      .expect({
        data: [getGarageAtIdx(0)],
        total: 10,
      });
  });

  it('get garages paginated 2', () => {
    return request(app.getHttpServer())
      .get('/garage?take=5&skip=5')
      .expect(200)
      .expect({
        data: [
          ...Array(5)
            .fill()
            .map((_, idx) => idx + 5)
            .map((v) => getGarageAtIdx(v)),
        ],
        total: 10,
      });
  });

  it('update one garage', async () => {
    await request(app.getHttpServer())
      .get('/garage/12')
      .expect(getGarageAtIdx(12));
    await request(app.getHttpServer())
      .patch('/garage/12')
      .set({ authorization: 'Bearer valid' })
      .send({ name: 'updated name' })
      .expect(200);
    await request(app.getHttpServer())
      .get('/garage/12')
      .expect({
        ...getGarageAtIdx(12),
        name: 'updated name',
      });
  });

  it('fails to update unowned garage', async () => {
    await request(app.getHttpServer())
      .patch('/garage/23')
      .set({ authorization: 'Bearer valid' })
      .send({ name: 'cannot' })
      .expect(403);
  });

  it('details about one garage', () => {
    return request(app.getHttpServer())
      .get('/garage/52')
      .expect(200)
      .expect({
        ...getGarageAtIdx(52),
      });
  });
});
