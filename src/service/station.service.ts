import { Injectable } from '@nestjs/common';
import { Station } from '@prisma/client';
import PrismaService from './prisma.service';
import { PaginationQuery } from 'src/lib/pipe/pagination-query.pipe';

@Injectable()
export class StationService {
  constructor(private prisma: PrismaService) {}

  async findAll({ take, skip }: PaginationQuery<Station>) {
    return {
      data: await this.prisma.station.findMany({
        take,
        skip,
        include: {
          lineStops: {
            include: {
              line: true,
            },
          },
        },
      }),
      total: await this.prisma.station.count(),
    };
  }

  async findOne(id: number) {
    return this.prisma.station.findFirstOrThrow({
      where: { id },
      include: {
        lineStops: {
          include: {
            line: true,
          },
        },
      },
    });
  }

  async create(data: Station) {
    return this.prisma.station.create({ data });
  }

  async updateOne(id: number, updates: Partial<Station>) {
    return this.prisma.station.update({
      where: { id },
      data: updates,
    });
  }

  async removeOne(id: number) {
    return this.prisma.station.delete({ where: { id } });
  }
}
