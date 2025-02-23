import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import JwtPayloadType from '@/modules/auth/types/jwt-payload.type';
import { AppConfigEnum } from '@/common/enums';
import { ConfigService } from '@nestjs/config';
import { JwtTokensType } from '@/modules/auth/types/jwt-tokens.type';

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	public async getTokens(payload: JwtPayloadType): Promise<JwtTokensType> {
		const NODE_ENV = this.configService.get<string>(AppConfigEnum.NODE_ENV);
		const [at, rt] = await Promise.all([
			this.jwtService.signAsync(payload, {
				secret: this.configService.get<string>(AppConfigEnum.AT_SECRET),
				expiresIn: NODE_ENV === 'production' ? '5m' : '15d',
			}),
			this.jwtService.signAsync(payload, {
				secret: this.configService.get<string>(AppConfigEnum.RT_SECRET),
				expiresIn: NODE_ENV === 'production' ? '15d' : '1y',
			}),
		]);

		return {
			accessToken: at,
			refreshToken: rt,
		};
	}

	public async decode(token: string): Promise<JwtPayloadType & { iat: number; exp: number }> {
		return this.jwtService.decode(token) as JwtPayloadType & { iat: number; exp: number };
	}
}
