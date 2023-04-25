import { Injectable } from '@nestjs/common';
import { Bus, Garage } from '@prisma/client';
import PrismaService from './prisma.service';
import { PaginationQuery } from 'src/lib/pipe/pagination-query.pipe';
import { BusCreateDto } from 'src/dto/bus/create.dto';

@Injectable()
export class BusService {
  constructor(private prisma: PrismaService) {}

  async findAll({ take, skip }: PaginationQuery<Bus & { garage: Garage }>) {
    return {
      data: await this.prisma.bus.findMany({
        take,
        skip,
        include: {
          garage: true,
        },
      }),
      total: await this.prisma.bus.count(),
    };
  }

  async findOne(id: number) {
    return this.prisma.bus.findFirstOrThrow({
      where: { id },
      include: { garage: true },
    });
  }

  async create(data: BusCreateDto) {
    return this.prisma.bus.create({ data });
  }

  async updateOne(id: number, updates: Partial<Bus>) {
    return this.prisma.bus.update({
      where: { id },
      data: updates,
    });
  }

  async removeOne(id: number) {
    return this.prisma.bus.delete({ where: { id } });
  }
}
