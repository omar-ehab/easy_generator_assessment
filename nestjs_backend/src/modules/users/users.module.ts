import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from '@/modules/users/entity/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from '@/modules/users/entity/session.entity';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
			},
			{
				name: Session.name,
				schema: SessionSchema,
			},
		]),
	],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
