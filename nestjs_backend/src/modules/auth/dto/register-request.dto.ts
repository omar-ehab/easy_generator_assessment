import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
	@ApiProperty({
		example: 'John Doe',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		example: 'test@app.com',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
		message: 'Password must contain at least one letter, one number, and one special character',
	})
	password: string;

	@ApiProperty({
		description: 'Fingerprint of the device if needed',
		required: false,
	})
	@IsOptional()
	@IsString()
	fingerprint?: string;

	@ApiProperty({
		description: 'refresh token mode, if cookie is set, refresh token will be set as secured cookie',
		example: 'json|cookie',
		required: false,
	})
	@IsOptional()
	@IsIn(['json', 'cookie'])
	mode?: 'json' | 'cookie';
}
