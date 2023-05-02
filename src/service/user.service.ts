import { Injectable } from '@nestjs/common';
import PrismaService from './prisma.service';
import RegisterDto from '../dto/user/register.dto';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export default class UserService {
  constructor(private prisma: PrismaService) {}

  async register(data: RegisterDto) {
    const emailActivationCode = crypto.randomUUID();
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
    const user = await this.prisma.user.update({
      where: { emailActivationCode },
      data: {
        emailActivationCode: null,
        status: UserStatus.activated,
      },
    });
    return user;
  }
}
