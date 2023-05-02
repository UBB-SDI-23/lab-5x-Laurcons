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
import { ReqUser } from 'src/lib/decorator/req-user';
import PaginationQueryPipe, {
  PaginationQuery,
} from 'src/lib/pipe/pagination-query.pipe';
import { StationService } from 'src/service/station.service';

@ApiTags('station')
@Controller('station')
export class StationController {
  constructor(private stationService: StationService) {}

  @Get('')
  @UsePipes(new PaginationQueryPipe({ sortableKeys: [] }))
  async findAll(@Query() query: PaginationQuery<Station>) {
    return this.stationService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.stationService.findOne(parseInt(id));
  }

  @Post('')
  async create(@ReqUser() user: User, @Body() content: any) {
    return this.stationService.create({ ...content, ownerId: user.id });
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() updates: any) {
    return this.stationService.updateOne(parseInt(id), updates);
  }

  @Delete(':id')
  async removeOne(@Param('id') id: string) {
    return this.stationService.removeOne(parseInt(id));
  }
}
