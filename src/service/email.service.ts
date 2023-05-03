import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import { config } from 'src/lib/config';

@Injectable()
export default class EmailService {
  constructor() {}

  sendVerificationEmail(user: User) {
    return new Promise<void>((res, rej) => {
      const mail = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        authMethod: 'PLAIN',
        auth: {
          user: config.email.from,
          pass: config.email.pass,
        },
      });
      mail.sendMail(
        {
          from: config.email.from,
          to: user.email,
          subject: 'Your MPP activation link',
          html: `Access this link for your activation link: ${config.frontendUrl}/auth/register/confirm?code=${user.emailActivationCode}`,
        },
        (err, info) => {
          if (err) return rej(err);
          res();
        },
      );
    });
  }
}
