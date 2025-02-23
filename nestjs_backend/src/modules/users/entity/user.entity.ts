import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Session, SessionSchema } from '@/modules/users/entity/session.entity';
import HashHelper from '@/helpers/HashHelper';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
	@Prop({
		required: true,
	})
	name: string;

	@Prop({
		required: true,
		unique: true,
	})
	email: string;

	@Prop({
		required: true,
		select: false,
	})
	password: string;

	@Prop({ type: [SessionSchema], default: [] })
	sessions: Session[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		this.password = await HashHelper.hash(this.password);
	}
	next();
});
