import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const GetRefreshToken = createParamDecorator((_: undefined, context: ExecutionContext) => {
	const request: FastifyRequest = context.switchToHttp().getRequest<FastifyRequest>();
	let token = null;
	if (request && request.cookies && request.cookies['x-refresh-token']) {
		token = request.cookies['x-refresh-token'];
	}
	if (request && request.headers && request.headers['x-refresh-token']) {
		if (request.headers['x-refresh-token'].includes('Bearer ')) {
			const fullToken = request.headers['rt'] as string;
			token = fullToken.split('Bearer ')[1];
		} else {
			token = request.headers['x-refresh-token'] as string;
		}
	}
	return token;
});
