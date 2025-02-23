import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import { AppConfigEnum } from '@/common/enums';
import JwtPayloadType from '@/modules/auth/types/jwt-payload.type';
import { JwtPayloadWithRtType } from '@/modules/auth/types/jwt-payload-with-rt.type';
import { UsersService } from '@/modules/users/users.service';

const customExtractor = function (req: FastifyRequest): string | null {
	let token = null;
	if (req && req.cookies && req.cookies['x-refresh-token']) {
		token = req.cookies['x-refresh-token'];
	}
	if (req && req.headers && req.headers['x-refresh-token']) {
		if (req.headers['x-refresh-token'].includes('Bearer ')) {
			const fullToken = req.headers['x-refresh-token'] as string;
			token = fullToken.split('Bearer ')[1];
		} else {
			token = req.headers['x-refresh-token'] as string;
		}
	}

	return token;
};

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(
		config: ConfigService,
		private readonly usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([customExtractor]),
			secretOrKey: config.get<string>(AppConfigEnum.RT_SECRET),
			passReqToCallback: true,
		});
	}

	async validate(req: FastifyRequest, payload: JwtPayloadType): Promise<JwtPayloadWithRtType> {
		let refresh_token = customExtractor(req);
		if (!refresh_token) {
			throw new ForbiddenException('Missing refresh token');
		}
		if (refresh_token.includes('Bearer ')) {
			refresh_token = refresh_token.split('Bearer ')[1];
		}
		const session = this.usersService.findSessionByRefreshToken(refresh_token);
		if (!session) {
			throw new ForbiddenException('Invalid refresh token');
		}
		return {
			...payload,
			refresh_token: refresh_token.trim(),
		};
	}
}
