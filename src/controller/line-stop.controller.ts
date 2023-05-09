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
import { LineStop, User } from '@prisma/client';
import { QueryDto } from 'src/dto/line-stop/query-dto';
import { AllowRoles } from 'src/lib/decorator/allow-roles';
import { Public } from 'src/lib/decorator/is-public';
import { ReqUser } from 'src/lib/decorator/req-user';
import { errors } from 'src/lib/errors';
import PaginationQueryPipe, {
  PaginationQuery,
} from 'src/lib/pipe/pagination-query.pipe';
import { LineStopService } from 'src/service/line-stop.service';

@ApiTags('line-stop')
@Controller('line-stop')
export class LineStopController {
  constructor(private lineStopService: LineStopService) {}

  @Public()
  @Get('')
  @UsePipes(new PaginationQueryPipe({ sortableKeys: [] }))
  async findAll(@Query() query: QueryDto & PaginationQuery<LineStop>) {
    return this.lineStopService.findAll(query);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.lineStopService.findOne(parseInt(id));
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Post('')
  async create(@ReqUser() user: User, @Body() content: LineStop) {
    return this.lineStopService.create({ ...content, ownerId: user.id });
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
      const entity = await this.lineStopService.findOne(id);
      if (entity.ownerId !== user.id) throw errors.user.insufficientPermissions;
    }
    return this.lineStopService.updateOne(id, updates);
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Delete(':id')
  async removeOne(@Param('id') id: string | number, @ReqUser() user: User) {
    id = parseInt(id as string);
    if (user.role !== 'moderator') {
      const entity = await this.lineStopService.findOne(id);
      if (entity.ownerId !== user.id) throw errors.user.insufficientPermissions;
    }
    return this.lineStopService.removeOne(id);
  }
}
