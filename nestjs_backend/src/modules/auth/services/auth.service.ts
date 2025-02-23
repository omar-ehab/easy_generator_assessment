import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AuthCredentialsRequestDto } from '@/modules/auth/dto/auth-credentials-request.dto';
import { InvalidCredentialsException } from '@/common/http/exceptions';
import HashHelper from '@/helpers/HashHelper';
import { TokenService } from '@/modules/auth/services/token.service';
import { UsersService } from '@/modules/users/users.service';
import dayjs from 'dayjs';
import { FastifyRequest } from 'fastify';
import { JwtTokensType } from '@/modules/auth/types/jwt-tokens.type';
import { RegisterRequestDto } from '@/modules/auth/dto/register-request.dto';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly usersService: UsersService,
		private readonly tokenService: TokenService,
	) {}

	public async login(
		req: FastifyRequest,
		ip: string,
		{ email, password, fingerprint }: AuthCredentialsRequestDto,
	): Promise<JwtTokensType> {
		const user = await this.usersService.findByEmail(email);
		if (!user) {
			this.logger.log(`User with email ${email} not found`);
			throw new InvalidCredentialsException();
		}
		this.logger.log(`User with email ${email} found`);
		const passwordMatch = await HashHelper.compare(password, user.password);
		if (!passwordMatch) {
			this.logger.log(`Password for user with email ${email} does not match`);
			throw new InvalidCredentialsException();
		}
		const payload = { id: user._id.toString(), email: user.email };
		this.logger.log(`Password for user with email ${email} matches`);
		return this.generateTokenAndSaveSession(payload, ip, req.headers['user-agent'], fingerprint);
	}

	public async register(
		req: FastifyRequest,
		ip: string,
		{ name, email, password, fingerprint }: RegisterRequestDto,
	): Promise<JwtTokensType> {
		const user = await this.usersService.findByEmail(email);
		if (user) {
			this.logger.log(`User with email ${email} already exists`);
			throw new BadRequestException({
				message: 'Email already exists',
				statusCode: 400,
			});
		}
		const newUser = await this.usersService.create({ name, email, password });
		const payload = { id: newUser._id.toString(), email: newUser.email };
		return this.generateTokenAndSaveSession(payload, ip, req.headers['user-agent'], fingerprint);
	}

	public async refresh(data: {
		userAgent: string;
		ip: string;
		userId: string;
		refreshToken: string;
		fingerPrint?: string;
	}): Promise<JwtTokensType> {
		const { userId, refreshToken, ip, userAgent } = data;
		const userWithSession = await this.usersService.findUserWithSessionByRefreshToken(userId, refreshToken);
		if (!userWithSession) {
			this.logger.log(`User with id ${userId} and refresh token ${refreshToken} not found`);
			throw new InvalidCredentialsException();
		}
		const payload = { id: userWithSession._id.toString(), email: userWithSession.email };
		return this.generateTokenAndSaveSession(payload, ip, userAgent, data.fingerPrint);
	}

	public async logout(userId: string, refreshToken: string): Promise<void> {
		const user = await this.usersService.findUserWithSessionByRefreshToken(userId, refreshToken);
		if (!user) {
			this.logger.log(`User with id ${userId} and refresh token ${refreshToken} not found`);
			throw new InvalidCredentialsException();
		}
		await this.usersService.deleteSession(userId, refreshToken);
	}

	private async generateTokenAndSaveSession(
		payload: {
			id: string;
			email: string;
		},
		ip: string,
		userAgent: string,
		fingerprint: string,
	): Promise<JwtTokensType> {
		const tokens = await this.tokenService.getTokens({ ...payload, id: payload.id });
		const decodedRefreshToken = await this.tokenService.decode(tokens.refreshToken);
		await this.usersService.createSession(payload.id, {
			refreshToken: tokens.refreshToken,
			refreshTokenExpires: dayjs(decodedRefreshToken.exp * 1000)
				.startOf('minute')
				.toDate(),
			ipAddress: ip,
			userAgent,
			fingerprint,
		});
		this.logger.log(`Session created for user with email ${payload.email}`);
		return tokens;
	}
}
