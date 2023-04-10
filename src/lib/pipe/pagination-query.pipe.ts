import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { Transform, plainToClass } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  validate,
} from 'class-validator';

export class PaginationQuery<T> {
  @IsNumber()
  @Min(0)
  @Transform((params) => parseInt(params.value))
  @IsOptional()
  skip?: number;

  @IsNumber()
  @Min(0)
  @Transform((params) => parseInt(params.value))
  @IsOptional()
  take?: number;

  @IsString()
  @IsOptional()
  orderBy?: keyof T;

  @IsIn(['asc', 'desc'])
  @IsOptional()
  direction?: 'asc' | 'desc';
}

// @Injectable()
export default class PaginationQueryPipe<T> implements PipeTransform<any, any> {
  constructor(
    private config: {
      sortableKeys: (keyof T)[];
    },
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') return;
    const obj = plainToClass(PaginationQuery, value);
    const errors = await validate(obj);
    if (errors.length !== 0) {
      throw new HttpException(
        {
          code: 'ValidationError',
          errors: errors.map((err) => ({
            property: err.property,
            errors: err.constraints,
          })),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (obj.orderBy && !this.config.sortableKeys.includes(obj.orderBy)) {
      throw new HttpException(
        {
          code: 'ValidationError',
          errors: [
            {
              property: 'orderBy',
              errors: [
                {
                  isSortableKey: 'orderBy must be a sortable key',
                },
              ],
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return obj;
  }
}
