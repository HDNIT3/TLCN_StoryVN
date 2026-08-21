import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from './user.schema';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class RefreshToken {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: User.name, required: true, index: true
    })
    userId: Types.ObjectId;

    @Prop({ required: true, index: true })
    tokenHash: string;

    @Prop({ required: true })
    expiresAt: Date;

    @Prop({ default: false })
    revoked: boolean;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

// tự động xoá document sau khi hết hạn (TTL Index)
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });