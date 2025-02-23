import JwtPayloadType from '@/modules/auth/types/jwt-payload.type';

export type JwtPayloadWithRtType = JwtPayloadType & { refresh_token: string };
