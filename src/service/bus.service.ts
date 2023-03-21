import { Injectable } from "@nestjs/common";
import { Bus } from "@prisma/client";
import PrismaService from "./prisma.service";

@Injectable()
export class BusService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.bus.findMany();
  }

  async findOne(id: number) {
    return this.prisma.bus.findFirstOrThrow({ where: { id }, include: { garage: true } });
  }

  async create(data: Bus) {
    return this.prisma.bus.create({ data });
  }

  async updateOne(id: number, updates: Partial<Bus>) {
    return this.prisma.bus.update({
      where: { id },
      data: updates
    });
  }

  async removeOne(id: number) {
    return this.prisma.bus.delete({ where: { id } });
  }
}