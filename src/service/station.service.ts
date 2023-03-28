import { Injectable } from "@nestjs/common";
import { Garage } from "@prisma/client";
import PrismaService from "./prisma.service";

@Injectable()
export class StationService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.station.findMany();
  }

  async findOne(id: number) {
    return this.prisma.station.findFirstOrThrow({
      where: { id },
      include: {
        lineStops: {
          include: {
            line: true
          }
        }
      }
    });
  }

  async create(data: Garage) {
    return this.prisma.station.create({ data });
  }

  async updateOne(id: number, updates: Partial<Garage>) {
    return this.prisma.station.update({
      where: { id },
      data: updates
    });
  }

  async removeOne(id: number) {
    return this.prisma.station.delete({ where: { id } });
  }

}