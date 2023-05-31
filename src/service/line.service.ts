import { Injectable } from '@nestjs/common';
import { Line, Prisma } from '@prisma/client';
import { isNumber } from 'class-validator';
import PrismaService from './prisma.service';
import { PaginationQuery } from 'src/lib/pipe/pagination-query.pipe';

@Injectable()
export class LineService {
  constructor(private prisma: PrismaService) {}

  async findAll({
    monthlyRidershipMin,
    take,
    skip,
  }: { monthlyRidershipMin?: number } & PaginationQuery<Line> = {}) {
    const where = {
      ...(isNumber(monthlyRidershipMin) && {
        monthlyRidership: { gte: monthlyRidershipMin },
      }),
    };
    const data = await this.prisma.line.findMany({
      take,
      skip,
      where,
      include: {
        endGarage: true,
        startGarage: true,
        lineStops: { include: { station: true } },
        owner: true,
      },
    });
    return {
      data,
      total: await this.prisma.line.count({ where }),
    };
  }

  async findOne(id: number) {
    return this.prisma.line.findFirstOrThrow({
      where: { id },
      include: {
        endGarage: true,
        startGarage: true,
        lineStops: { include: { station: true } },
      },
    });
  }

  async create(data: Prisma.LineUncheckedCreateInput) {
    return this.prisma.line.create({ data });
  }

  async updateOne(id: number, updates: Partial<Line>) {
    return this.prisma.line.update({
      where: { id },
      data: updates,
    });
  }

  async removeOne(id: number) {
    return this.prisma.line.delete({ where: { id } });
  }

  async longestLines() {
    const lines = await this.prisma.line.findMany({
      include: {
        _count: {
          select: {
            lineStops: true,
          },
        },
      },
    });
    lines.sort((a, b) => (a._count.lineStops < b._count.lineStops ? 1 : -1));
    return lines;
  }
}
