import { Injectable } from '@nestjs/common';
import PrismaService from './prisma.service';
import RegisterDto from '../dto/user/register.dto';
import { Prisma, User, UserProfile, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { config } from 'src/lib/config';
import { PatchUserDto } from 'src/dto/user/patch-user.dto';
import { errors } from 'src/lib/errors';

@Injectable()
export default class UserService {
  constructor(private prisma: PrismaService) {}

  async register(data: RegisterDto) {
    const emailActivationCode = jwt.sign({}, config.jwtSecret, {
      expiresIn: '10m',
    });
    const password = await bcrypt.hash(data.password, 12);
    return this.prisma.user.create({
      data: {
        ...data,
        password,
        emailActivationCode,
      },
    });
  }

  async verifyEmailCode(emailActivationCode: string) {
    jwt.verify(emailActivationCode, config.jwtSecret);
    const user = await this.prisma.user.update({
      where: { emailActivationCode },
      data: {
        emailActivationCode: null,
        status: UserStatus.activated,
      },
    });
    return user;
  }

  async getWithProfile(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  async patch(id: number, data: PatchUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    // verify password
    if (!(await bcrypt.compare(data.oldPassword, user.password)))
      throw errors.user.invalidPassword;
    const password = data.password
      ? await bcrypt.hash(data.password, 12)
      : undefined;
    return await this.prisma.user.update({
      where: { id },
      data: {
        username: data.username,
        password,
      },
    });
  }

  async getProfile(id: number) {
    return await this.prisma.userProfile.findUnique({ where: { id } });
  }

  async patchProfile(id: number, data: Partial<UserProfile>) {
    return await this.prisma.userProfile.update({
      where: { userId: id },
      data,
    });
  }
}
