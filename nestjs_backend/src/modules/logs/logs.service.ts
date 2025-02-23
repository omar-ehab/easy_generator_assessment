import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from '@/modules/logs/entity/log.entity';

@Injectable()
export class LogsService {
	constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

	async createLog(level: string, message: string, context?: string, stack?: string): Promise<Log> {
		const log = new this.logModel({ level, message, context, stack });
		return log.save();
	}
}
