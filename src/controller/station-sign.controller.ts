import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AllowRoles } from 'src/lib/decorator/allow-roles';
import { Public } from 'src/lib/decorator/is-public';
import { ReqUser } from 'src/lib/decorator/req-user';
import { StationSignService } from 'src/service/station-sign.service';

@ApiTags('station-sign')
@Controller('station-sign')
export class StationSignController {
  constructor(private stationSignService: StationSignService) {}

  @Public()
  @Get('')
  async findAll() {
    return this.stationSignService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.stationSignService.findOne(parseInt(id));
  }

  @AllowRoles(['moderator', 'admin'])
  @Post('')
  async create(@ReqUser() user: User, @Body() content: any) {
    return this.stationSignService.create({ ...content, ownerId: user.id });
  }

  @AllowRoles(['moderator', 'admin'])
  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() updates: any) {
    return this.stationSignService.updateOne(parseInt(id), updates);
  }

  @AllowRoles(['moderator', 'admin'])
  @Delete(':id')
  async removeOne(@Param('id') id: string) {
    return this.stationSignService.removeOne(parseInt(id));
  }
}
