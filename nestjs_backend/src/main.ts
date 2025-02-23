import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import fastifyCookie from '@fastify/cookie';
import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import { AppConfigEnum } from '@/common/enums';
import { HttpExceptionFilter, HttpResponseInterceptor } from '@/common/http';
import { Logger } from '@nestjs/common';
import { CustomValidationPipe } from '@/common/pipes/custom-validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppLogger } from '@/modules/logs/logger.service';

function setupSwagger(app: NestFastifyApplication) {
	const options = new DocumentBuilder()
		.setTitle('API Documentation')
		.setDescription('API Documentation')
		.setVersion('0.0.1')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('docs', app, document);
}

const CORS_OPTIONS = {
	origin: [
		'http://localhost:5173',
		'http://localhost:5174',
		// add your frontend url here
	],
	allowedHeaders: [
		'Access-Control-Allow-Origin',
		'Origin',
		'X-Requested-With',
		'Accept',
		'Content-Type',
		'Authorization',
		'x-refresh-token',
	],
	exposedHeaders: ['Authorization', 'Content-Type'],
	credentials: true,
	methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE'],
};

async function bootstrap() {
	const adapter = new FastifyAdapter({ trustProxy: true });
	adapter.enableCors(CORS_OPTIONS);
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);
	const configService = app.get(ConfigService);
	const port = configService.get<string>(AppConfigEnum.PORT, '3000');
	await app.register(fastifyCookie, {
		secret: configService.get<string>(AppConfigEnum.COOKIE_SECRET, 'COOKIE_SECRET'),
	});
	await app.register(helmet, { contentSecurityPolicy: false });
	await app.register(compression);
	const logger = app.get(AppLogger);
	app.useLogger(logger);
	app.useGlobalFilters(new HttpExceptionFilter(logger));
	app.useGlobalInterceptors(new HttpResponseInterceptor());
	app.useGlobalPipes(new CustomValidationPipe());
	app.setGlobalPrefix('api');
	setupSwagger(app);
	await app.listen(port);
	return port;
}

bootstrap().then((port) => {
	Logger.log(`Application running on port: ${port}`, 'Main');
});
