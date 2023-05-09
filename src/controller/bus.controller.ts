import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BusService } from 'src/service/bus.service';
import BigIntInterceptor from '../lib/interceptor/bigint-interceptor';
import PaginationQueryPipe, {
  PaginationQuery,
} from 'src/lib/pipe/pagination-query.pipe';
import { Bus, User } from '@prisma/client';
import { BusCreateDto } from 'src/dto/bus/create.dto';
import { BusUpdateDto } from 'src/dto/bus/update.dto';
import { ReqUser } from 'src/lib/decorator/req-user';
import { Public } from 'src/lib/decorator/is-public';
import { AllowRoles } from 'src/lib/decorator/allow-roles';
import { errors } from 'src/lib/errors';

@ApiTags('bus')
@Controller('bus')
export class BusController {
  constructor(private busService: BusService) {}

  @Public()
  @Get('')
  @UsePipes(new PaginationQueryPipe<Bus>({ sortableKeys: [] }))
  @UseInterceptors(BigIntInterceptor)
  async findAll(@Query() query: PaginationQuery<Bus>) {
    return this.busService.findAll(query);
  }

  @Public()
  @Get(':id')
  @UseInterceptors(BigIntInterceptor)
  async findOne(@Param('id') id: string) {
    return this.busService.findOne(parseInt(id));
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Post('')
  async create(@ReqUser() user: User, @Body() content: BusCreateDto) {
    return this.busService.create({ ...content, ownerId: user.id });
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Patch(':id')
  async updateOne(
    @Param('id') id: string | number,
    @Body() updates: BusUpdateDto,
    @ReqUser() user: User,
  ) {
    id = parseInt(id as string);
    if (user.role !== 'moderator') {
      const entity = await this.busService.findOne(id);
      if (entity.ownerId !== user.id) throw errors.user.insufficientPermissions;
    }
    return this.busService.updateOne(id, updates);
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Delete(':id')
  async removeOne(@Param('id') id: string | number, @ReqUser() user: User) {
    id = parseInt(id as string);
    if (user.role !== 'moderator') {
      const entity = await this.busService.findOne(id);
      if (entity.ownerId !== user.id) throw errors.user.insufficientPermissions;
    }
    return this.busService.removeOne(id);
  }
}
