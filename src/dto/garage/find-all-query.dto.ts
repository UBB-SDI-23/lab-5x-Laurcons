import { IsIn, IsOptional, IsString } from "class-validator";

export class FindAllQueryDto {
  @IsString()
  @IsOptional()
  orderBy?: string;
  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  direction?: 'asc' | 'desc';
}