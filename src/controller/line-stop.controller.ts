import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LineStop } from "@prisma/client";
import { QueryDto } from "src/dto/line-stop/query-dto";
import { LineStopService } from "src/service/line-stop.service";

@ApiTags('line-stop')
@Controller('line-stop')
export class LineStopController {
  constructor(
    private lineStopService: LineStopService
  ) { }

  @Get('')
  async findAll(@Query() query: QueryDto) {
    return this.lineStopService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.lineStopService.findOne(parseInt(id));
  }

  @Post('')
  async create(@Body() content: LineStop) {
    return this.lineStopService.create(content);
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