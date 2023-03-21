import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { LineService } from "src/service/line.service";

@Controller('line')
export class LineController {
  constructor(
    private lineService: LineService
  ) { }

  @Get('')
  async findAll(@Query('monthlyRidershipMin') monthlyRidershipMin: string) {
    return this.lineService.findAll({
      ...(monthlyRidershipMin && {
        monthlyRidershipMin: parseInt(monthlyRidershipMin)
      }),
    });
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    return this.lineService.findOne(name);
  }

  @Post('')
  async create(@Body() content: any) {
    return this.lineService.create(content);
  }

  @Patch(':name')
  async updateOne(@Param('name') name: string, @Body() updates: any) {
    return this.lineService.updateOne(name, updates);
  }

  @Delete(':name')
  async removeOne(@Param('name') name: string) {
    return this.lineService.removeOne(name);
  }
}