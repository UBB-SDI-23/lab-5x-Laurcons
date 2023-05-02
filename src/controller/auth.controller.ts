import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import LoginDto from 'src/dto/user/login.dto';
import RegisterDto from 'src/dto/user/register.dto';
import AuthService from 'src/service/auth.service';
import UserService from 'src/service/user.service';

@Controller('/auth')
export default class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/login')
  async login(@Body() { username, password }: LoginDto) {
    const { user, token } = await this.authService.verifyCredentials(
      username,
      password,
    );
    return {
      user,
      token,
    };
  }

  @Post('/register')
  async register(@Body() data: RegisterDto) {
    const user = await this.userService.register(data);
    return {
      user,
      token: await this.authService.generateToken(user),
    };
  }

  @Get('/activate/:token')
  async activateEmail(@Param('token') token: string, @Res() res: Response) {
    try {
      await this.userService.verifyEmailCode(token);
      res
        .contentType('text/plain')
        .send('Email validation successful, you may return to the app');
    } catch (err: any) {
      res
        .contentType('text/plain')
        .send('Something happened while validating your email');
    }
  }
}
