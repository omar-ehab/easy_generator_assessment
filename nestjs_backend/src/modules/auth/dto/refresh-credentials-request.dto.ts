import { IsIn, IsOptional, IsString } from 'class-validator';

export class RefreshCredentialsRequestDto {
	@IsOptional()
	@IsString()
	fingerprint?: string;

	@IsOptional()
	@IsIn(['json', 'cookie'])
	mode?: 'json' | 'cookie';
}
