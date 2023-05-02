import { UserProfile } from '@prisma/client';
import {
  IsDate,
  IsDateString,
  IsISO31661Alpha2,
  IsISO8601,
  IsString,
  IsUrl,
} from 'class-validator';

export class PatchProfileDto
  implements Partial<Omit<UserProfile, 'id' | 'userId'>>
{
  @IsDate()
  birthDate: Date;

  @IsString()
  bio: string;

  @IsString()
  gender: string;

  @IsISO31661Alpha2()
  location: string;

  @IsUrl()
  website: string;
}
