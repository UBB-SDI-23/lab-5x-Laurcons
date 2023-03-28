import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { GarageService } from "src/service/garage.service";
import { StationService } from "src/service/station.service";

@Controller('station')
export class StationController {
  constructor(
    private stationService: StationService
  ) { }

  @Get('')
  async findAll() {
    return this.stationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.stationService.findOne(parseInt(id));
  }

  @Post('')
  async create(@Body() content: any) {
    return this.stationService.create(content);
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