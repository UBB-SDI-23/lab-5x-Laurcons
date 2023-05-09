import { HttpException } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(status: number, public code: string, message: string) {
    super(code, status, { description: message });
  }
}

export const errors = {
  auth: {
    invalidCredentials: new AppException(
      422,
      'InvalidCredentials',
      'Your credentials are invalid',
    ),
    invalidToken: new AppException(
      403,
      'InvalidToken',
      'Your auth token is invalid',
    ),
    emailNotConfirmed: new AppException(
      422,
      'EmailNotConfirmed',
      'Please confirm your email',
    ),
  },
  user: {
    invalidPassword: new AppException(
      422,
      'InvalidPassword',
      'Your password is invalid',
    ),
    insufficientPermissions: new AppException(
      422,
      'InsufficientPermissions',
      "You don't have enough permissions to do this action",
    ),
  },
};
