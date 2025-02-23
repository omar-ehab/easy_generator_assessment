import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import JwtPayloadType from '@/modules/auth/types/jwt-payload.type';

export const GetCurrentUserId = createParamDecorator((_: undefined, context: ExecutionContext): string => {
	const request = context.switchToHttp().getRequest();
	const user = request.user as JwtPayloadType;
	return user.id;
});
