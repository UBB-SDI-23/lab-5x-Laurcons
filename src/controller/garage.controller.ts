import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import AddManyBusesDto from "src/dto/garage/add-many-buses.dto";
import { FindAllQueryDto } from "src/dto/garage/find-all-query.dto";
import { BusService } from "src/service/bus.service";
import { GarageService } from "src/service/garage.service";

@ApiTags('garage')
@Controller('garage')
export class GarageController {
  constructor(
    private garageService: GarageService
  ) { }

  @Get('')
  async findAll(@Query() query: FindAllQueryDto) {
    return this.garageService.findAll({
      ...(query.orderBy && {
        orderBy: {
          [query.orderBy]: query.direction,
        },
      }),
    });
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

  @Patch(':id/bus/add-many')
  @ApiOperation({ description: "Adds multiple (existing) buses to this garage." })
  async addBusesToGarage(@Param('id') garageId: string, @Body() { busIds }: AddManyBusesDto) {
    return this.garageService.addBusesToGarage(parseInt(garageId), busIds);
  }
}