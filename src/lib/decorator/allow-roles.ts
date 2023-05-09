import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ALLOW_ROLES = 'ALLOW_ROLES';
export const AllowRoles = (roles: UserRole[]) =>
  SetMetadata(ALLOW_ROLES, roles);
