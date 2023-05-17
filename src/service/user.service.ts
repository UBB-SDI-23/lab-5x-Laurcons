import { Injectable } from '@nestjs/common';
import PrismaService from './prisma.service';
import RegisterDto from '../dto/user/register.dto';
import { Prisma, User, UserProfile, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { config } from 'src/lib/config';
import { PatchUserDto } from 'src/dto/user/patch-user.dto';
import { errors } from 'src/lib/errors';
import EmailService from './email.service';
import * as crypto from 'crypto';
import { PaginationQuery } from 'src/lib/pipe/pagination-query.pipe';
import AdminPatchUserDto from 'src/dto/user/admin-patch-user.dto';

@Injectable()
export default class UserService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async register(data: RegisterDto) {
    const emailActivationCode = crypto.randomUUID();
    const password = await bcrypt.hash(data.password, 12);
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password,
        emailActivationCode,
      },
    });
    await this.emailService.sendVerificationEmail(user);
    return user;
  }

  async verifyEmailCode(emailActivationCode: string) {
    return await this.prisma.user.update({
      where: { emailActivationCode },
      data: {
        emailActivationCode: null,
        status: UserStatus.activated,
      },
    });
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
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId: id },
      include: { user: true },
    });
    if (!profile) return null;
    const [counts] = await this.prisma.user.findMany({
      where: { id },
      select: {
        _count: {
          select: {
            buses: true,
            garages: true,
            lines: true,
            lineStops: true,
            stations: true,
            stationSigns: true,
          },
        },
      },
    });
    return {
      ...profile,
      ...counts,
    };
  }

  async patchProfile(id: number, data: Omit<UserProfile, 'id'>) {
    return await this.prisma.userProfile.upsert({
      where: { userId: id },
      create: data,
      update: data,
    });
  }

  async getAllUsers({ take, skip }: PaginationQuery<User>) {
    return {
      data: await this.prisma.user.findMany({
        take,
        skip,
      }),
      total: await this.prisma.user.count(),
    };
  }

  async adminPatch(id: number, data: any) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
