import { Injectable } from "@nestjs/common";
import { StationSign } from "@prisma/client";
import PrismaService from "./prisma.service";

@Injectable()
export class StationSignService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.stationSign.findMany();
  }

  async findOne(id: number) {
    return this.prisma.stationSign.findFirstOrThrow({ where: { id }, include: { station: true } });
  }

  async create(data: StationSign) {
    return this.prisma.stationSign.create({ data });
  }

  async updateOne(id: number, updates: Partial<StationSign>) {
    return this.prisma.stationSign.update({
      where: { id },
      data: updates
    });
  }

  async removeOne(id: number) {
    return this.prisma.stationSign.delete({ where: { id } });
  }
}