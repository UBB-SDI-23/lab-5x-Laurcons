import { Module } from '@nestjs/common';
import { BusController } from './controller/bus.controller';
import { GarageController } from './controller/garage.controller';
import { LineController } from './controller/line.controller';
import { BusService } from './service/bus.service';
import { GarageService } from './service/garage.service';
import { LineService } from './service/line.service';
import PrismaService from './service/prisma.service';

@Module({
  imports: [],
  controllers: [
    BusController,
    GarageController,
    LineController,
  ],
  providers: [
    BusService,
    GarageService,
    LineService,
    PrismaService,
  ],
})
export class AppModule { }
