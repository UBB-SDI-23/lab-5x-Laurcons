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
import PaginationQueryPipe from './lib/pipe/pagination-query.pipe';
import AuthController from './controller/auth.controller';
import UserService from './service/user.service';
import AuthService from './service/auth.service';

@Module({
  imports: [],
  controllers: [
    AuthController,
    BusController,
    GarageController,
    LineController,
    StationController,
    LineStopController,
    StationSignController,
  ],
  providers: [
    UserService,
    AuthService,
    BusService,
    GarageService,
    LineService,
    StationService,
    LineStopService,
    StationSignService,
    PrismaService,
    PaginationQueryPipe,
  ],
})
export class AppModule {}
