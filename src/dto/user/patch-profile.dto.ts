import { UserProfile } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsISO31661Alpha2,
  IsISO8601,
  IsString,
  IsUrl,
} from 'class-validator';

export class PatchProfileDto implements Omit<UserProfile, 'id' | 'userId'> {
  @IsDate()
  @Transform(({ value, obj }) => (obj.birthDate = new Date(value)))
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
