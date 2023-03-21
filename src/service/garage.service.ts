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
}