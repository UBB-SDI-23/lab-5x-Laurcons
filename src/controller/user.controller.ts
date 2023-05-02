import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { User } from '@prisma/client';
import { PatchProfileDto } from 'src/dto/user/patch-profile.dto';
import { PatchUserDto } from 'src/dto/user/patch-user.dto';
import { ReqUser } from 'src/lib/decorator/req-user';
import UserService from 'src/service/user.service';

@Controller('/user')
export default class AuthController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMe(@ReqUser() user: User) {
    return user;
  }

  @Patch('me')
  async patchMe(@ReqUser() user: User, @Body() data: PatchUserDto) {
    return await this.userService.patch(user.id, data);
  }

  @Get('me/profile')
  async getProfile(@ReqUser() user: User) {
    return await this.userService.getProfile(user.id);
  }

  @Patch('me/profile')
  async patchProfile(@ReqUser() user: User, @Body() data: PatchProfileDto) {
    return await this.userService.patchProfile(user.id, data);
  }
}
