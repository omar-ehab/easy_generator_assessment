import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ResponseDto } from '@/common/dto';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor<T> {
	/**
	 * Intercept the request and add the timestamp
	 * @param context {ExecutionContext}
	 * @param next {CallHandler}
	 * @returns { payload:Response<T>, timestamp: string }
	 */
	intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<T>> {
		return next.handle().pipe(
			map((payload) => {
				return { payload };
			}),
		);
	}
}
