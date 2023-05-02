import { Bus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class BusCreateDto implements Omit<Bus, 'id' | 'ownerId'> {
  @IsString()
  manufacturer: string;

  @IsString()
  model: string;

  @IsString()
  fuel: string;

  @IsNumberString()
  inventoryNum: string;

  @IsString()
  @Matches(/([A-Z]{2}( )?[0-9]{2}( )?[A-Z]{3})|(CJ-N( )?[0-9]{5,6})/)
  @Transform(({ value, obj }) => (obj.licensePlate = value.replace(/ /g, '')))
  licensePlate: string;

  @IsNumber()
  garageId: number;
}
