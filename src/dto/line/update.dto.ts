import { Line } from '@prisma/client';
import {
  IsDivisibleBy,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export default class UpdateLineDto implements Partial<Line> {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  startName: string;

  @IsString()
  @IsOptional()
  endName: string;

  @IsPositive()
  @IsOptional()
  startGarageId: number;

  @IsPositive()
  @IsOptional()
  endGarageId: number;

  @IsPositive()
  @IsDivisibleBy(100) // it's an estimate so should be multiple of 100
  @IsOptional()
  monthlyRidership: number;
}
