import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ALLOW_ROLES } from '../decorator/allow-roles';
import { User, UserRole } from '@prisma/client';
import { IS_PUBLIC } from 'src/lib/decorator/is-public';

@Injectable()
export default class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    const allowedRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ALLOW_ROLES,
      [context.getHandler(), context.getClass()],
    );
    const req = context.switchToHttp().getRequest<Request>();
    const user = (req as any).user as User;

    console.log({ user, isPublic, allowedRoles });

    if (isPublic) return true;

    return allowedRoles ? allowedRoles.includes(user.role) : true;
  }
}
