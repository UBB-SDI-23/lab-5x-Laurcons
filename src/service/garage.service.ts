import { Injectable } from '@nestjs/common';
import { Garage, Prisma } from '@prisma/client';
import PrismaService from './prisma.service';
import { PaginationQuery } from 'src/lib/pipe/pagination-query.pipe';

@Injectable()
export class GarageService {
  constructor(private prisma: PrismaService) {}

  async findAll({ take, skip, orderBy, direction }: PaginationQuery<Garage>) {
    return {
      data: await this.prisma.garage.findMany({
        take,
        skip,
        ...(orderBy && {
          orderBy: {
            [orderBy]: direction,
          },
        }),
      }),
      total: await this.prisma.garage.count(),
    };
  }

  async findOne(id: number) {
    return this.prisma.garage.findFirstOrThrow({
      where: { id },
      include: { buses: true, startingLines: true, endingLines: true },
    });
  }

  async create(data: Garage) {
    return this.prisma.garage.create({ data });
  }

  async updateOne(id: number, updates: Partial<Garage>) {
    return this.prisma.garage.update({
      where: { id },
      data: updates,
    });
  }

  async removeOne(id: number) {
    return this.prisma.garage.delete({ where: { id } });
  }

  async biggestGarages({
    take,
    skip,
    orderBy,
    direction,
  }: PaginationQuery<Garage>) {
    const garages = await this.prisma.garage.findMany({
      include: {
        _count: {
          select: {
            buses: true,
          },
        },
      },
      take,
      skip,
      ...(orderBy && {
        orderBy: {
          [orderBy]: direction,
        },
      }),
    });

    garages.sort((a, b) => (a._count.buses < b._count.buses ? 1 : -1));

    return {
      data: garages,
      total: await this.prisma.garage.count(),
    };
  }

  async addBusesToGarage(garageId: number, busIds: number[]) {
    return this.prisma.bus.updateMany({
      where: { id: { in: busIds } },
      data: { garageId },
    });
  }
}
