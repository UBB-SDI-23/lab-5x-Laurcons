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

@ApiTags('bus')
@Controller('bus')
export class BusController {
  constructor(private busService: BusService) {}

  @Get('')
  @UsePipes(new PaginationQueryPipe<Bus>({ sortableKeys: [] }))
  @UseInterceptors(BigIntInterceptor)
  async findAll(@Query() query: PaginationQuery<Bus>) {
    return this.busService.findAll(query);
  }

  @Get(':id')
  @UseInterceptors(BigIntInterceptor)
  async findOne(@Param('id') id: string) {
    return this.busService.findOne(parseInt(id));
  }

  @Post('')
  async create(@ReqUser() user: User, @Body() content: BusCreateDto) {
    return this.busService.create({ ...content, ownerId: user.id });
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() updates: BusUpdateDto) {
    return this.busService.updateOne(parseInt(id), updates);
  }

  @Delete(':id')
  async removeOne(@Param('id') id: string) {
    return this.busService.removeOne(parseInt(id));
  }
}
