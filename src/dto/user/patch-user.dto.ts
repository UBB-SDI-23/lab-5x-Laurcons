import { User, UserStatus } from '@prisma/client';
import { IsString, Matches } from 'class-validator';

export class PatchUserDto implements Pick<User, 'password' | 'username'> {
  @IsString()
  @Matches(/[a-zA-Z_]{3,12}/)
  username: string;

  @IsString()
  @Matches(/[\S]{4,}/, { message: 'Your password is not secure enough' })
  password: string;

  @IsString()
  oldPassword: string;
}
