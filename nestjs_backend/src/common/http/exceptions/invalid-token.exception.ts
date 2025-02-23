import { UnauthorizedException } from '@nestjs/common';
import { ErrorType } from '@/common/enums';

export class InvalidTokenException extends UnauthorizedException {
	constructor() {
		super({ errorType: ErrorType.InvalidToken });
	}
}
