import { IsString, Matches } from 'class-validator';

export default class RegisterDto {
  @IsString()
  username: string;

  @Matches(/[\S]{4,}/, { message: 'Your password is not secure enough' })
  @IsString()
  password: string;
}
