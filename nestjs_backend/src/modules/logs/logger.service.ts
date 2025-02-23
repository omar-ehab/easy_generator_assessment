import { ConsoleLogger, Injectable } from '@nestjs/common';
import { LogsService } from './logs.service';

@Injectable()
export class AppLogger extends ConsoleLogger {
	constructor(private readonly logsService: LogsService) {
		super();
	}

	log(message: string, context?: string) {
		if (this.shouldIgnore(context)) return;
		super.log(message, context);
		this.logsService.createLog('log', message, context).catch(console.error);
	}

	warn(message: string, context?: string) {
		if (this.shouldIgnore(context)) return;
		super.warn(message, context);
		this.logsService.createLog('warn', message, context).catch(console.error);
	}

	error(message: string, trace?: string, context?: string) {
		if (this.shouldIgnore(context)) return;
		super.error(message, trace, context);
		this.logsService.createLog('error', message, context, trace).catch(console.error);
	}

	debug(message: string, context?: string) {
		if (this.shouldIgnore(context)) return;
		super.debug(message, context);
		this.logsService.createLog('debug', message, context).catch(console.error);
	}

	verbose(message: string, context?: string) {
		if (this.shouldIgnore(context)) return;
		super.verbose(message, context);
		this.logsService.createLog('verbose', message, context).catch(console.error);
	}

	private shouldIgnore(context?: string): boolean {
		const ignoredContexts = ['RouterExplorer', 'InstanceLoader', 'NestFactory', 'RoutesResolver'];
		return context ? ignoredContexts.includes(context) : false;
	}
}
