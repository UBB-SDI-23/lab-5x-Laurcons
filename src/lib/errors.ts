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
      422,
      'InvalidToken',
      'Your auth token is invalid',
    ),
  },
};
