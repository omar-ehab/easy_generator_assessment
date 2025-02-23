import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ThrottlerLimitDetail } from '@nestjs/throttler/dist/throttler.guard.interface';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
	private readonly logger = new Logger(ThrottlerBehindProxyGuard.name);

	protected async getTracker(req: Record<string, any>): Promise<string> {
		return req.ips.length ? req.ips[0] : req.ip;
	}

	protected async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail) {
		const request = context.switchToHttp().getRequest();
		this.logger.warn(
			`(${request.method} ${request.url}): Throttler limit reached (${throttlerLimitDetail.limit}) for ${request.ip}`,
		);
		throw new HttpException(
			{
				statusCode: HttpStatus.TOO_MANY_REQUESTS,
				error: 'Too Many Requests',
				message: 'Too Many Requests.',
			},
			429,
		);
	}
}
