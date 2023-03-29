import { Injectable } from "@nestjs/common";
import { Garage } from "@prisma/client";
import PrismaService from "./prisma.service";

@Injectable()
export class GarageService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.garage.findMany();
  }

  async findOne(id: number) {
    return this.prisma.garage.findFirstOrThrow({ where: { id }, include: { buses: true, startingLines: true, endingLines: true } });
  }

  async create(data: Garage) {
    return this.prisma.garage.create({ data });
  }

  async updateOne(id: number, updates: Partial<Garage>) {
    return this.prisma.garage.update({
      where: { id },
      data: updates
    });
  }

  async removeOne(id: number) {
    return this.prisma.garage.delete({ where: { id } });
  }

  async biggestGarages() {
    const garages = await this.prisma.garage.findMany({
      include: {
        _count: {
          select: {
            buses: true
          }
        }
      }
    });

    return garages.sort((a, b) => a._count.buses < b._count.buses ? 1 : -1);
  }

  async addBusesToGarage(garageId: number, busIds: number[]) {
    return this.prisma.bus.updateMany({
      where: { id: { in: busIds } },
      data: { garageId },
    });
  }
}