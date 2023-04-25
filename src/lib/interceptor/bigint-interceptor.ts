import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { isArray, isNumber, isObject } from 'class-validator';
import { Observable, map, tap } from 'rxjs';

export default class BigIntInterceptor implements NestInterceptor {
  private transformItem(item: any) {
    for (const key in item) {
      const val = item[key];
      if (typeof val === 'bigint') item[key] = val.toString();
    }
    return item;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((responseJson) => {
        if (typeof responseJson !== 'object') return;
        return isArray(responseJson.data) && isNumber(responseJson.total)
          ? {
              ...responseJson,
              data: responseJson.data.map(this.transformItem),
            }
          : isArray(responseJson)
          ? responseJson.map(this.transformItem)
          : this.transformItem(responseJson);
      }),
      tap(console.log),
    );
  }
}
