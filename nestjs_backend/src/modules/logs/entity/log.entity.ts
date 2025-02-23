import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;

@Schema({ timestamps: true })
export class Log {
	@Prop({ required: true })
	level: string;

	@Prop({ required: true })
	message: string;

	@Prop()
	context?: string;

	@Prop()
	stack?: string;

	@Prop({ default: Date.now, index: -1 })
	createdAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
