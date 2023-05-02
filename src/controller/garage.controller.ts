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
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Garage, User } from '@prisma/client';
import AddManyBusesDto from 'src/dto/garage/add-many-buses.dto';
import { FindAllQueryDto } from 'src/dto/garage/find-all-query.dto';
import { ReqUser } from 'src/lib/decorator/req-user';
import PaginationQueryPipe, {
  PaginationQuery,
} from 'src/lib/pipe/pagination-query.pipe';
import { GarageService } from 'src/service/garage.service';

@ApiTags('garage')
@Controller('garage')
export class GarageController {
  constructor(private garageService: GarageService) {}

  @Get('')
  @UsePipes(
    new PaginationQueryPipe<Garage>({
      sortableKeys: ['id', 'location', 'name'],
    }),
  )
  async findAll(@Query() query: PaginationQuery<Garage>) {
    return this.garageService.findAll(query);
  }

  @Get('biggestGarages')
  @UsePipes(new PaginationQueryPipe<Garage>({ sortableKeys: [] }))
  async biggestGarages(@Query() query: PaginationQuery<Garage>) {
    return this.garageService.biggestGarages(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.garageService.findOne(parseInt(id));
  }

  @Post('')
  async create(@ReqUser() user: User, @Body() content: any) {
    return this.garageService.create({ ...content, ownerId: user.id });
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
  @ApiOperation({
    description: 'Adds multiple (existing) buses to this garage.',
  })
  async addBusesToGarage(
    @Param('id') garageId: string,
    @Body() { busIds }: AddManyBusesDto,
  ) {
    return this.garageService.addBusesToGarage(parseInt(garageId), busIds);
  }
}
