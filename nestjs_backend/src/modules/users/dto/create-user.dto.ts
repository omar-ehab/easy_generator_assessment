import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsString()
	@IsNotEmpty()
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {})
	password: string;
}
