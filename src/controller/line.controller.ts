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
import { Line, User } from '@prisma/client';
import CreateLineDto from 'src/dto/line/create.dto';
import UpdateLineDto from 'src/dto/line/update.dto';
import { AllowRoles } from 'src/lib/decorator/allow-roles';
import { Public } from 'src/lib/decorator/is-public';
import { ReqUser } from 'src/lib/decorator/req-user';
import { errors } from 'src/lib/errors';
import PaginationQueryPipe, {
  PaginationQuery,
} from 'src/lib/pipe/pagination-query.pipe';
import { LineService } from 'src/service/line.service';

@ApiTags('line')
@Controller('line')
export class LineController {
  constructor(private lineService: LineService) {}

  @Public()
  @Get('')
  @UsePipes(new PaginationQueryPipe({ sortableKeys: [] }))
  async findAll(
    @Query()
    {
      monthlyRidershipMin,
      ...pagQuery
    }: PaginationQuery<Line> & { monthlyRidershipMin: string },
  ) {
    return this.lineService.findAll({
      ...(monthlyRidershipMin && {
        monthlyRidershipMin: parseInt(monthlyRidershipMin),
      }),
      ...pagQuery,
    });
  }

  @Public()
  @Get('longestLines')
  async longestLines() {
    return this.lineService.longestLines();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.lineService.findOne(parseInt(id));
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Post('')
  async create(@ReqUser() user: User, @Body() content: CreateLineDto) {
    return this.lineService.create({ ...content, ownerId: user.id });
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Patch(':id')
  async updateOne(
    @Param('id') id: string | number,
    @Body() updates: UpdateLineDto,
    @ReqUser() user: User,
  ) {
    id = parseInt(id as string);
    if (user.role !== 'moderator') {
      const entity = await this.lineService.findOne(id);
      if (entity.ownerId !== user.id) throw errors.user.insufficientPermissions;
    }
    return this.lineService.updateOne(id, updates);
  }

  @AllowRoles(['regular', 'moderator', 'admin'])
  @Delete(':id')
  async removeOne(@Param('id') id: string | number, @ReqUser() user: User) {
    id = parseInt(id as string);
    if (user.role !== 'moderator') {
      const entity = await this.lineService.findOne(id);
      if (entity.ownerId !== user.id) throw errors.user.insufficientPermissions;
    }
    return this.lineService.removeOne(id);
  }
}
