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
import { Line } from '@prisma/client';
import LineDto from 'src/dto/line/line-dto';
import PaginationQueryPipe, {
  PaginationQuery,
} from 'src/lib/pipe/pagination-query.pipe';
import { LineService } from 'src/service/line.service';

@ApiTags('line')
@Controller('line')
export class LineController {
  constructor(private lineService: LineService) {}

  @Get('')
  @UsePipes(new PaginationQueryPipe({ sortableKeys: [] }))
  async findAll(
    @Query()
    {
      monthlyRidershipMin,
      ...pagQuery
    }: PaginationQuery<Line> & { monthlyRidershipMin: string },
  ) {
    return this.lineService.findAll({
      ...(monthlyRidershipMin && {
        monthlyRidershipMin: parseInt(monthlyRidershipMin),
      }),
      ...pagQuery,
    });
  }

  @Get('longestLines')
  async longestLines() {
    return this.lineService.longestLines();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.lineService.findOne(parseInt(id));
  }

  @Post('')
  async create(@Body() content: LineDto) {
    return this.lineService.create(content);
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() updates: any) {
    return this.lineService.updateOne(parseInt(id), updates);
  }

  @Delete(':id')
  async removeOne(@Param('id') id: string) {
    return this.lineService.removeOne(parseInt(id));
  }
}
