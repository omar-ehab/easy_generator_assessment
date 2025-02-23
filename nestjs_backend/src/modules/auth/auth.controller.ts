import { Body, Controller, HttpCode, HttpStatus, Ip, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '@/modules/auth/services';
import { AuthCredentialsRequestDto } from '@/modules/auth/dto/auth-credentials-request.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { AppConfigEnum } from '@/common/enums';
import dayjs from 'dayjs';
import { RtGuard } from '@/modules/auth/guards/rt.guard';
import { GetCurrentUserId } from '@/common/decorators/get-current-user-id.decorator';
import { GetRefreshToken } from '@/common/decorators/get-refresh-token.decorator';
import { RefreshCredentialsRequestDto } from '@/modules/auth/dto/refresh-credentials-request.dto';
import { ApiBody, ApiHeader, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterRequestDto } from '@/modules/auth/dto/register-request.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	private readonly logger = new Logger(AuthController.name);

	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	@Post('login')
	@ApiResponse({ status: 401, description: 'Invalid Credentials' })
	@ApiBody({
		type: AuthCredentialsRequestDto,
		description: 'User credentials',
	})
	@ApiOkResponse({
		description: 'Login successful, returns access and refresh tokens.',
		schema: {
			type: 'object',
			properties: {
				payload: {
					type: 'object',
					properties: {
						access_token: { type: 'string', example: 'access token' },
						refresh_token: { type: 'string', example: 'refresh token' },
					},
				},
			},
		},
	})
	@HttpCode(HttpStatus.OK)
	public async login(
		@Req() request: FastifyRequest,
		@Res({ passthrough: true }) response: FastifyReply,
		@Ip() ip: string,
		@Body() body: AuthCredentialsRequestDto,
	) {
		this.logger.log(`Login attempt from ${ip}`);
		const { mode } = body;
		const { accessToken, refreshToken } = await this.authService.login(request, ip, body);
		if (mode === 'cookie') {
			response.setCookie('x-refresh-token', refreshToken, {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: this.configService.get<string>(AppConfigEnum.NODE_ENV) === 'production',
				expires:
					this.configService.get<string>(AppConfigEnum.NODE_ENV) === 'production'
						? dayjs().add(15, 'days').toDate()
						: dayjs().add(1, 'year').toDate(),
			});
			return { access_token: accessToken };
		}
		return { access_token: accessToken, refresh_token: refreshToken };
	}

	@Post('register')
	@ApiBody({
		type: RegisterRequestDto,
		description: 'User credentials',
	})
	@ApiOkResponse({
		description: 'Account Created successfully, returns access and refresh tokens.',
		schema: {
			type: 'object',
			properties: {
				payload: {
					type: 'object',
					properties: {
						access_token: { type: 'string', example: 'access token' },
						refresh_token: { type: 'string', example: 'refresh token' },
					},
				},
			},
		},
	})
	@HttpCode(HttpStatus.OK)
	public async register(
		@Req() request: FastifyRequest,
		@Res({ passthrough: true }) response: FastifyReply,
		@Ip() ip: string,
		@Body() body: RegisterRequestDto,
	) {
		this.logger.log(`Register attempt from ${ip}`);
		const { mode } = body;
		const { accessToken, refreshToken } = await this.authService.register(request, ip, body);
		if (mode === 'cookie') {
			response.setCookie('x-refresh-token', refreshToken, {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: this.configService.get<string>(AppConfigEnum.NODE_ENV) === 'production',
				expires:
					this.configService.get<string>(AppConfigEnum.NODE_ENV) === 'production'
						? dayjs().add(15, 'days').toDate()
						: dayjs().add(1, 'year').toDate(),
			});
			return { access_token: accessToken };
		}
		return { access_token: accessToken, refresh_token: refreshToken };
	}

	@Post('refresh')
	@ApiResponse({ status: 401, description: 'Invalid Credentials' })
	@ApiHeader({
		name: 'x-refresh-token',
		description: 'Refresh token if not using cookie mode',
		required: false,
	})
	@ApiOkResponse({
		description: 'Token Refreshed successful, returns new access and refresh tokens.',
		schema: {
			type: 'object',
			properties: {
				payload: {
					type: 'object',
					properties: {
						access_token: { type: 'string', example: 'access token' },
						refresh_token: { type: 'string', example: 'refresh token' },
					},
				},
			},
		},
	})
	@UseGuards(RtGuard)
	@HttpCode(HttpStatus.OK)
	public async refresh(
		@Req() request: FastifyRequest,
		@Res({ passthrough: true }) response: FastifyReply,
		@Ip() ip: string,
		@Body() body: RefreshCredentialsRequestDto,
		@GetCurrentUserId() userId: string,
		@GetRefreshToken() oldRefreshToken: string,
	) {
		this.logger.log(`Refresh attempt from ${ip}`);
		const { accessToken, refreshToken } = await this.authService.refresh({
			userAgent: request.headers['user-agent'],
			ip,
			userId,
			refreshToken: oldRefreshToken,
		});
		if (body.mode === 'cookie') {
			response.setCookie('x-refresh-token', refreshToken, {
				httpOnly: true,
				sameSite: 'lax',
				secure: this.configService.get<string>(AppConfigEnum.NODE_ENV) === 'production',
				path: '/',
				expires:
					this.configService.get<string>(AppConfigEnum.NODE_ENV) === 'production'
						? dayjs().add(15, 'days').toDate()
						: dayjs().add(1, 'year').toDate(),
			});
			return { access_token: accessToken };
		}
		return { access_token: accessToken, refresh_token: refreshToken };
	}

	@Post('logout')
	@ApiResponse({ status: 401, description: 'Invalid Credentials' })
	@ApiHeader({
		name: 'x-refresh-token',
		description: 'Refresh token if not using cookie mode',
		required: false,
	})
	@ApiResponse({ status: 204, description: 'Logout successful' })
	@UseGuards(RtGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	public async logout(
		@Res({ passthrough: true }) response: FastifyReply,
		@GetCurrentUserId() userId: string,
		@GetRefreshToken() refreshToken: string,
	) {
		this.logger.log(`Logout attempt from user with id ${userId}`);
		response.clearCookie('x-refresh-token');
		await this.authService.logout(userId, refreshToken);
		this.logger.log(`User with id ${userId} logged out`);
	}
}
