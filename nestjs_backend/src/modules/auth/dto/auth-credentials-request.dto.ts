import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsRequestDto {
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
