import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class CustomValidationPipe extends ValidationPipe {
	constructor() {
		super({
			exceptionFactory: (errors: ValidationError[]) => {
				const result = errors.map((error) => ({
					property: error.property,
					message: error.constraints[Object.keys(error.constraints)[0]],
				}));
				return new BadRequestException(result);
			},
		});
	}
}
