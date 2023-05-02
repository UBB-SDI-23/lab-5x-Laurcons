import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import AuthService from 'src/service/auth.service';
import { IS_PUBLIC } from './is-public';
import { Reflector } from '@nestjs/core';

export default class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) return true;

      const req = context.switchToHttp().getRequest<Request>();
      const authoriz = req.headers['authorization'];
      const token = authoriz.split(' ').pop();

      const user = await this.authService.verifyToken(token);
      (req as any).user = user;
    } catch (err: any) {
      console.error(err);
      return false;
    }
    return true;
  }
}
