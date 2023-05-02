import { HttpException, Injectable } from '@nestjs/common';
import PrismaService from './prisma.service';
import * as bcrypt from 'bcrypt';
import { errors } from '../lib/errors';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { config } from '../lib/config';

@Injectable()
export default class AuthService {
  constructor(private prisma: PrismaService) {}

  async generateToken(user: User) {
    return jwt.sign({ id: user.id }, config.jwtSecret);
  }

  async verifyCredentials(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) throw errors.auth.invalidCredentials;
    const result = await bcrypt.compare(password, user.password);
    if (!result) throw errors.auth.invalidCredentials;

    return {
      token: await this.generateToken(user),
      user: user as User,
    };
  }

  async verifyToken(token: string) {
    try {
      const { id } = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
      const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });
      return user as User;
    } catch (err: any) {
      if (err instanceof jwt.JsonWebTokenError) {
        throw errors.auth.invalidToken;
      }
      throw err;
    }
  }
}
