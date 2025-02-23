import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from '@/modules/logs/entity/log.entity';
import { LogsService } from './logs.service';
import { AppLogger } from '@/modules/logs/logger.service';

@Global()
@Module({
	imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
	providers: [LogsService, AppLogger],
	exports: [AppLogger],
})
export class LogsModule {}
