import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema({ timestamps: true })
export class Session {
	@Prop({
		required: true,
	})
	refreshToken: string;

	@Prop({
		required: true,
		expires: 0,
	})
	refreshTokenExpires: Date;

	@Prop({
		required: true,
	})
	ipAddress: string;

	@Prop({ required: true })
	userAgent: string;

	@Prop()
	fingerprint?: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
