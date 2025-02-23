import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigEnum } from '@/common/enums';
import JwtPayloadType from '@/modules/auth/types/jwt-payload.type';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get<string>(AppConfigEnum.AT_SECRET),
		});
	}

	validate(payload: JwtPayloadType) {
		return payload;
	}
}
