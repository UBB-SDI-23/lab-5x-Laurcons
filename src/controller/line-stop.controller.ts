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
import { LineStop, User } from '@prisma/client';
import { QueryDto } from 'src/dto/line-stop/query-dto';
import { ReqUser } from 'src/lib/decorator/req-user';
import PaginationQueryPipe, {
  PaginationQuery,
} from 'src/lib/pipe/pagination-query.pipe';
import { LineStopService } from 'src/service/line-stop.service';

@ApiTags('line-stop')
@Controller('line-stop')
export class LineStopController {
  constructor(private lineStopService: LineStopService) {}

  @Get('')
  @UsePipes(new PaginationQueryPipe({ sortableKeys: [] }))
  async findAll(@Query() query: QueryDto & PaginationQuery<LineStop>) {
    return this.lineStopService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.lineStopService.findOne(parseInt(id));
  }

  @Post('')
  async create(@ReqUser() user: User, @Body() content: LineStop) {
    return this.lineStopService.create({ ...content, ownerId: user.id });
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() updates: any) {
    return this.lineStopService.updateOne(parseInt(id), updates);
  }

  @Delete(':id')
  async removeOne(@Param('id') id: string) {
    return this.lineStopService.removeOne(parseInt(id));
  }
}
