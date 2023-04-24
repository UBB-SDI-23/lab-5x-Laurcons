import { Bus } from '@prisma/client';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class BusUpdateDto implements Omit<Bus, 'id'> {
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
  @IsOptional()
  licensePlate: string;

  @IsNumber()
  @IsOptional()
  garageId: number;
}
