import { Injectable } from '@nestjs/common';
import PrismaService from './prisma.service';
import RegisterDto from '../dto/user/register.dto';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { config } from 'src/lib/config';

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
}
