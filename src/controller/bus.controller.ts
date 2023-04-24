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
import { Bus } from '@prisma/client';

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
  async create(@Body() content: any) {
    return this.busService.create(content);
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() updates: any) {
    return this.busService.updateOne(parseInt(id), updates);
  }

  @Delete(':id')
  async removeOne(@Param('id') id: string) {
    return this.busService.removeOne(parseInt(id));
  }
}
