import { Line } from '@prisma/client';
import { IsDivisibleBy, IsNumber, IsPositive, IsString } from 'class-validator';

export default class CreateLineDto implements Omit<Line, 'id'> {
  @IsString()
  name: string;

  @IsString()
  startName: string;

  @IsString()
  endName: string;

  @IsPositive()
  startGarageId: number;

  @IsPositive()
  endGarageId: number;

  @IsPositive()
  @IsDivisibleBy(100) // it's an estimate so should be multiple of 100
  monthlyRidership: number;

  // added in controller
  ownerId: number;
}
