import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from '@/modules/auth/services/token.service';
import { UsersModule } from '@/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from '@/modules/auth/strategies/at.strategy';
import { RtStrategy } from '@/modules/auth/strategies/rt.strategy';

@Module({
	imports: [UsersModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, TokenService, AtStrategy, RtStrategy],
})
export class AuthModule {}
