import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UsersModule } from '@/modules/users/users.module';

@Module({
	imports: [UsersModule],
	controllers: [ProfileController],
	providers: [ProfileService],
})
export class ProfileModule {}
