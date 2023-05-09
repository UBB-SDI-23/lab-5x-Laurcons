import { UserRole } from '@prisma/client';
import { IsEnum } from 'class-validator';

export default class AdminPatchUserDto {
  @IsEnum(UserRole)
  role: UserRole;
}
