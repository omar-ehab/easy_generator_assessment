import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class ProfileService {
	constructor(private readonly usersService: UsersService) {}

	async userProfile(userId: string) {
		const user = await this.usersService.findById(userId);
		return {
			id: user._id.toString(),
			email: user.email,
			name: user.name,
		};
	}
}
