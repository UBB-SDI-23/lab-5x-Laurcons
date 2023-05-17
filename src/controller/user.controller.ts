import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UsePipes,
} from '@nestjs/common';
import { User } from '@prisma/client';
import AdminPatchUserDto from 'src/dto/user/admin-patch-user.dto';
import { PatchProfileDto } from 'src/dto/user/patch-profile.dto';
import { PatchUserDto } from 'src/dto/user/patch-user.dto';
import { AllowRoles } from 'src/lib/decorator/allow-roles';
import { ReqUser } from 'src/lib/decorator/req-user';
import { AppException } from 'src/lib/errors';
import PaginationQueryPipe, {
  PaginationQuery,
} from 'src/lib/pipe/pagination-query.pipe';
import UserService from 'src/service/user.service';

@Controller('/user')
export default class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMe(@ReqUser() user: User) {
    return await this.userService.getWithProfile(user.id);
  }

  @Patch('me')
  async patchMe(@ReqUser() user: User, @Body() data: PatchUserDto) {
    return await this.userService.patch(user.id, data);
  }

  @Get(':who/profile')
  async getProfile(@ReqUser() user: User, @Param('who') who: string) {
    const profile = await this.userService.getProfile(
      who === 'me' ? user.id : parseInt(who),
    );
    if (!profile) throw new AppException(404, 'NotFound', 'Not found');
    return profile;
  }

  @Patch('me/profile')
  async patchProfile(@ReqUser() user: User, @Body() data: PatchProfileDto) {
    return await this.userService.patchProfile(user.id, {
      ...data,
      userId: user.id,
    });
  }

  @AllowRoles(['admin'])
  @UsePipes(
    new PaginationQueryPipe({
      sortableKeys: [],
    }),
  )
  @Get('/')
  async getAll(@Query() query: PaginationQuery<User>) {
    return await this.userService.getAllUsers(query);
  }

  @AllowRoles(['admin'])
  @Patch('/:id')
  async adminPatch(@Param('id') id: number | string, @Body() body: any) {
    id = parseInt(id as string);
    return await this.userService.adminPatch(id, body);
  }
}
