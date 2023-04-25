import { Injectable, Query } from '@nestjs/common';
import { LineStop } from '@prisma/client';
import { QueryDto } from 'src/dto/line-stop/query-dto';
import PrismaService from './prisma.service';
import { PaginationQuery } from 'src/lib/pipe/pagination-query.pipe';

@Injectable()
export class LineStopService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryDto & PaginationQuery<LineStop>) {
    const { lineId, stationId, take, skip, search } = query;
    const where = { lineId, stationId };
    return {
      data: await this.prisma.lineStop.findMany({
        take,
        skip,
        where,
      }),
      total: await this.prisma.lineStop.count({ where }),
    };
  }

  async findOne(id: number) {
    return this.prisma.lineStop.findFirstOrThrow({
      where: { id },
      include: {
        line: true,
        station: true,
      },
    });
  }

  async create(data: LineStop) {
    return this.prisma.lineStop.create({ data });
  }

  async updateOne(id: number, updates: Partial<LineStop>) {
    return this.prisma.lineStop.update({
      where: { id },
      data: updates,
    });
  }

  async removeOne(id: number) {
    return this.prisma.lineStop.delete({ where: { id } });
  }
}
