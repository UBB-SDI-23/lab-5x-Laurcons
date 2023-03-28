import { Module } from '@nestjs/common';
import { BusController } from './controller/bus.controller';
import { GarageController } from './controller/garage.controller';
import { LineStopController } from './controller/line-stop.controller';
import { LineController } from './controller/line.controller';
import { StationSignController } from './controller/station-sign.controller';
import { StationController } from './controller/station.controller';
import { BusService } from './service/bus.service';
import { GarageService } from './service/garage.service';
import { LineStopService } from './service/line-stop.service';
import { LineService } from './service/line.service';
import PrismaService from './service/prisma.service';
import { StationSignService } from './service/station-sign.service';
import { StationService } from './service/station.service';

@Module({
  imports: [],
  controllers: [
    BusController,
    GarageController,
    LineController,
    StationController,
    LineStopController,
    StationSignController,
  ],
  providers: [
    BusService,
    GarageService,
    LineService,
    StationService,
    LineStopService,
    StationSignService,
    PrismaService,
  ],
})
export class AppModule { }
