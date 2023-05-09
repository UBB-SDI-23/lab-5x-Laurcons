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
import { AllowRoles } from 'src/lib/decorator/allow-roles';
import { Public } from 'src/lib/decorator/is-public';
import { ReqUser } from 'src/lib/decorator/req-user';
import { errors } from 'src/lib/errors';
import PaginationQueryPipe, {
  PaginationQuery,
} from 'src/lib/pipe/pagination-query.pipe';
import { GarageService } from 'src/service/garage.service';

@ApiTags('garage')
@Controller('garage')
export class GarageController {
  constructor(private garageService: GarageService) {}

  @Public()
  @Get('')
  @UsePipes(
    new PaginationQueryPipe<Garage>({
      sortableKeys: ['id', 'location', 'name'],
    }),
  )
  async findAll(@Query() query: PaginationQuery<Garage>) {
    return this.garageService.findAll(query);
  }

  @Public()
  @Get('biggestGarages')
  @UsePipes(new PaginationQueryPipe<Garage>({ sortableKeys: [] }))
  async biggestGarages(@Query() query: PaginationQuery<Garage>) {
    return this.garageService.biggestGarages(query);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.garageService.findOne(parseInt(id));
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Post('')
  async create(@ReqUser() user: User, @Body() content: any) {
    return this.garageService.create({ ...content, ownerId: user.id });
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Patch(':id')
  async updateOne(
    @Param('id') id: string | number,
    @Body() updates: any,
    @ReqUser() user: User,
  ) {
    id = parseInt(id as string);
    if (user.role !== 'moderator') {
      const entity = await this.garageService.findOne(id);
      if (entity.ownerId !== user.id) throw errors.user.insufficientPermissions;
    }
    return this.garageService.updateOne(id, updates);
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Delete(':id')
  async removeOne(@Param('id') id: string | number, @ReqUser() user: User) {
    id = parseInt(id as string);
    if (user.role !== 'moderator') {
      const entity = await this.garageService.findOne(id);
      if (entity.ownerId !== user.id) throw errors.user.insufficientPermissions;
    }
    return this.garageService.removeOne(id);
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Patch(':id/bus/add-many')
  @ApiOperation({
    description: 'Adds multiple (existing) buses to this garage.',
  })
  async addBusesToGarage(
    @Param('id') garageId: string | number,
    @Body() { busIds }: AddManyBusesDto,
    @ReqUser() user: User,
  ) {
    garageId = parseInt(garageId as string);
    if (user.role !== 'moderator') {
      const entity = await this.garageService.findOne(garageId);
      if (entity.ownerId !== user.id) throw errors.user.insufficientPermissions;
    }
    return this.garageService.addBusesToGarage(garageId, busIds);
  }
}
