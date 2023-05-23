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
import { APP_GUARD } from '@nestjs/core';
import AuthGuard from './lib/guard/auth.guard';
import UserController from './controller/user.controller';
import EmailService from './service/email.service';
import RoleGuard from 'src/lib/guard/role.guard';
import AdminController from 'src/controller/admin.controller';
import AdminService from 'src/service/admin.service';
import { ChatGateway } from 'src/gateway/chat.gateway';
import { ChatService } from 'src/service/chat.service';

@Module({
  imports: [],
  controllers: [
    AuthController,
    UserController,
    BusController,
    GarageController,
    LineController,
    StationController,
    LineStopController,
    StationSignController,
    AdminController,
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
    EmailService,
    AdminService,
    ChatService,
    PaginationQueryPipe,
    ChatGateway,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
