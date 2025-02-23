import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerBehindProxyGuard } from '@/common/guards/throttler-behind-proxy.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigEnum } from '@/common/enums';
import { ProfileModule } from './modules/profile/profile.module';
import { LogsModule } from './modules/logs/logs.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get<string>(AppConfigEnum.DB_URL),
			}),
			inject: [ConfigService],
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60000, // 1 minute
				limit: 60, // 60 requests
			},
		]),
		AuthModule,
		UsersModule,
		ProfileModule,
		LogsModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerBehindProxyGuard,
		},
	],
})
export class AppModule {}
