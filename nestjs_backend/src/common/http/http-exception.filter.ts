import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { HttpErrorType } from './http-error-type';
import { ErrorType } from '@/common/enums';
import { AppLogger } from '@/modules/logs/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	constructor(private readonly logger: AppLogger) {}

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();
		const request = ctx.getRequest();
		const status = exception.getStatus();

		const exceptionResponse = exception.getResponse() as {
			errorType?: ErrorType | string;
			message: string | string[];
		};

		let errorType = exceptionResponse.errorType;
		const message = exceptionResponse.message;

		if (!errorType) {
			errorType = HttpErrorType[status] ?? 'UNEXPECTED_ERROR';
		}

		// Log error to MongoDB
		this.logger.error(`HTTP ${status} Error: ${JSON.stringify(message)}`, exception.stack, request.url);

		response.status(status).send({
			statusCode: status,
			errorType,
			message,
		});
	}
}
