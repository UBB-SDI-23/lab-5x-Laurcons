import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BusService } from "src/service/bus.service";

@ApiTags('bus')
@Controller('bus')
export class BusController {
  constructor(
    private busService: BusService
  ) { }

  @Get('')
  async findAll() {
    return this.busService.findAll();
  }

  @Get(':id')
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