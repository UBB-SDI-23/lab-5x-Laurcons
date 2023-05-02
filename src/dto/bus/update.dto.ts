import { Bus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class BusUpdateDto implements Omit<Bus, 'id' | 'ownerId'> {
  @IsString()
  @IsOptional()
  manufacturer: string;

  @IsString()
  @IsOptional()
  model: string;

  @IsString()
  @IsOptional()
  fuel: string;

  @IsNumberString()
  @IsOptional()
  inventoryNum: string;

  @IsString()
  @Matches(/([A-Z]{2}( )?[0-9]{2}( )?[A-Z]{3})|(CJ-N( )?[0-9]{5,6})/)
  @Transform(({ value, obj }) => (obj.licensePlate = value.replace(/ /g, '')))
  @IsOptional()
  licensePlate: string;

  @IsNumber()
  @IsOptional()
  garageId: number;
}
