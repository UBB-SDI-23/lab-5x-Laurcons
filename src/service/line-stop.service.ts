import { Injectable, Query } from "@nestjs/common";
import { LineStop } from "@prisma/client";
import { QueryDto } from "src/dto/line-stop/query-dto";
import PrismaService from "./prisma.service";

@Injectable()
export class LineStopService {
  constructor(private prisma: PrismaService) { }

  async findAll(query: QueryDto) {
    const { lineId, stationId } = query;
    return this.prisma.lineStop.findMany({
      where: { lineId, stationId }
    });
  }

  async findOne(id: number) {
    return this.prisma.lineStop.findFirstOrThrow({
      where: { id },
      include: {
        line: true,
        station: true,
      }
    });
  }

  async create(data: LineStop) {
    return this.prisma.lineStop.create({ data });
  }

  async updateOne(id: number, updates: Partial<LineStop>) {
    return this.prisma.lineStop.update({
      where: { id },
      data: updates
    });
  }

  async removeOne(id: number) {
    return this.prisma.lineStop.delete({ where: { id } });
  }

}