import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { BusService } from "src/service/bus.service";
import { GarageService } from "src/service/garage.service";

@Controller('garage')
export class GarageController {
  constructor(
    private garageService: GarageService
  ) { }

  @Get('')
  async findAll() {
    return this.garageService.findAll();
  }

  @Get('biggestGarages')
  async biggestGarages() {
    return this.garageService.biggestGarages();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.garageService.findOne(parseInt(id));
  }

  @Post('')
  async create(@Body() content: any) {
    return this.garageService.create(content);
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() updates: any) {
    return this.garageService.updateOne(parseInt(id), updates);
  }

  @Delete(':id')
  async removeOne(@Param('id') id: string) {
    return this.garageService.removeOne(parseInt(id));
  }
}