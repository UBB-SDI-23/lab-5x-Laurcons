import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Station, User } from '@prisma/client';
import { AllowRoles } from 'src/lib/decorator/allow-roles';
import { Public } from 'src/lib/decorator/is-public';
import { ReqUser } from 'src/lib/decorator/req-user';
import { errors } from 'src/lib/errors';
import PaginationQueryPipe, {
  PaginationQuery,
} from 'src/lib/pipe/pagination-query.pipe';
import { StationService } from 'src/service/station.service';

@ApiTags('station')
@Controller('station')
export class StationController {
  constructor(private stationService: StationService) {}

  @Public()
  @Get('')
  @UsePipes(new PaginationQueryPipe({ sortableKeys: [] }))
  async findAll(@Query() query: PaginationQuery<Station>) {
    return this.stationService.findAll(query);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.stationService.findOne(parseInt(id));
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Post('')
  async create(@ReqUser() user: User, @Body() content: any) {
    return this.stationService.create({ ...content, ownerId: user.id });
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Patch(':id')
  async updateOne(
    @Param('id') id: string | number,
    @Body() updates: any,
    @ReqUser() user: User,
  ) {
    id = parseInt(id as string);
    if (user.role !== 'moderator') {
      const entity = await this.stationService.findOne(id);
      if (entity.ownerId !== user.id) throw errors.user.insufficientPermissions;
    }
    return this.stationService.updateOne(id, updates);
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Delete(':id')
  async removeOne(@Param('id') id: string | number, @ReqUser() user: User) {
    id = parseInt(id as string);
    if (user.role !== 'moderator') {
      const entity = await this.stationService.findOne(id);
      if (entity.ownerId !== user.id) throw errors.user.insufficientPermissions;
    }
    return this.stationService.removeOne(id);
  }
}
