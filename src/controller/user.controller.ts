import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { User } from '@prisma/client';
import { PatchProfileDto } from 'src/dto/user/patch-profile.dto';
import { PatchUserDto } from 'src/dto/user/patch-user.dto';
import { ReqUser } from 'src/lib/decorator/req-user';
import { AppException } from 'src/lib/errors';
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
}
