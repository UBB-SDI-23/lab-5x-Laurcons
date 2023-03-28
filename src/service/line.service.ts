import { Injectable } from "@nestjs/common";
import { Line } from "@prisma/client";
import { isNumber } from "class-validator";
import PrismaService from "./prisma.service";

@Injectable()
export class LineService {
  constructor(private prisma: PrismaService) { }

  async findAll({ monthlyRidershipMin }: { monthlyRidershipMin?: number } = {}) {
    return this.prisma.line.findMany({
      where: {
        ...(isNumber(monthlyRidershipMin) && {
          monthlyRidership: { gte: monthlyRidershipMin }
        }),
      },
    });
  }

  async findOne(name: string) {
    return this.prisma.line.findFirstOrThrow({ where: { name }, include: { endGarage: true, startGarage: true } });
  }

  async create(data: Line) {
    return this.prisma.line.create({ data });
  }

  async updateOne(name: string, updates: Partial<Line>) {
    return this.prisma.line.update({
      where: { name },
      data: updates
    });
  }

  async removeOne(name: string) {
    return this.prisma.line.delete({ where: { name } });
  }

  async longestLines() {
    const lines = await this.prisma.line.findMany({
      include: {
        _count: {
          select: {
            lineStops: true
          }
        }
      }
    });
    lines.sort((a, b) => a._count.lineStops < b._count.lineStops ? 1 : -1);
    return lines;
  }
}