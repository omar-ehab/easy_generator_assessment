import { UnauthorizedException } from '@nestjs/common';
import { ErrorType } from '@/common/enums';

export class RefreshTokenExpiredException extends UnauthorizedException {
	constructor() {
		super({
			errorType: ErrorType.RefreshTokenExpired,
			message: 'Refresh token has expired',
		});
	}
}
