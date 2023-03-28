import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { StationSignService } from "src/service/station-sign.service";

@Controller('station-sign')
export class StationSignController {
  constructor(
    private stationSignService: StationSignService
  ) { }

  @Get('')
  async findAll() {
    return this.stationSignService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.stationSignService.findOne(parseInt(id));
  }

  @Post('')
  async create(@Body() content: any) {
    return this.stationSignService.create(content);
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() updates: any) {
    return this.stationSignService.updateOne(parseInt(id), updates);
  }

  @Delete(':id')
  async removeOne(@Param('id') id: string) {
    return this.stationSignService.removeOne(parseInt(id));
  }
}