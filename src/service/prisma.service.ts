import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

export default interface IPrismaService {
  new(): PrismaClient;
}

@Injectable()
export default class PrismaService extends PrismaClient implements IPrismaService {
  constructor() {
    super();
  }
}