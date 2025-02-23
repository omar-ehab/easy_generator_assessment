import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { GetCurrentUserId } from '@/common/decorators/get-current-user-id.decorator';
import { AtGuard } from '@/modules/auth/guards/at.guard';
import { ProfileService } from '@/modules/profile/profile.service';
import { ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get('')
	@ApiOkResponse({
		description: 'User profile retrieved successfully',
		schema: {
			type: 'object',
			properties: {
				payload: {
					type: 'object',
					properties: {
						id: { type: 'string', example: 'User ID' },
						name: { type: 'string', example: 'John Doe' },
						email: { type: 'string', example: 'john@doe.com' },
					},
				},
			},
		},
	})
	@ApiUnauthorizedResponse({ description: 'Unauthorized, invalid token' })
	@UseGuards(AtGuard)
	@HttpCode(HttpStatus.OK)
	public async findUser(@GetCurrentUserId() userId: string) {
		return this.profileService.userProfile(userId);
	}
}
