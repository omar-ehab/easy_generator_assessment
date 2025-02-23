import { Injectable, Logger } from '@nestjs/common';
import { User, UserDocument } from '@/modules/users/entity/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { Session } from '@/modules/users/entity/session.entity';

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name);
	constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

	async create(createUserDto: CreateUserDto): Promise<UserDocument | null> {
		this.logger.log(`Creating user with email ${createUserDto.email}`);
		return this.userModel.create(createUserDto);
	}

	async findByEmail(email: string): Promise<UserDocument | null> {
		this.logger.log(`Finding user with email ${email}`);
		return this.userModel.findOne({ email }).select('+password').exec();
	}

	async findById(id: string): Promise<UserDocument | null> {
		this.logger.log(`Finding user with id ${id}`);
		return this.userModel.findById(id).exec();
	}

	async findSessionByRefreshToken(refreshToken: string): Promise<Session | null> {
		this.logger.log(`Finding session with refresh token ${refreshToken}`);
		return this.userModel
			.findOne({ 'sessions.refreshToken': refreshToken }, { 'sessions.$': 1 })
			.then((user) => user?.sessions[0] || null);
	}

	async findUserWithSessionByRefreshToken(userId: string, refreshToken: string): Promise<UserDocument | null> {
		this.logger.log(`Finding user with id ${userId} and refresh token ${refreshToken}`);
		return this.userModel
			.findOne({ 'sessions.refreshToken': refreshToken, _id: userId }, { 'sessions.$': 1 })
			.then((user) => user || null);
	}

	async deleteSession(userId: string, refreshToken: string): Promise<void> {
		this.logger.log(`Deleting session with refresh token ${refreshToken}`);
		await this.userModel.updateOne({ _id: userId }, { $pull: { sessions: { refreshToken } } });
	}

	async createSession(userId: string, session: Session): Promise<void> {
		this.logger.log(`Creating session for user with id ${userId}`);
		await this.userModel.updateOne({ _id: userId }, { $push: { sessions: session } });
	}
}
