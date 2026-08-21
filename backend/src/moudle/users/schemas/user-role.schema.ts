import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from './user.schema';
import { Role } from './role.schema';

export type UserRoleDocument = HydratedDocument<UserRole>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class UserRole {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: User.name, required: true, index: true
    })
    userId: Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: Role.name, required: true, index: true
    })
    roleId: Types.ObjectId;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);

// không bị gán trùng 1 role 2 lần
UserRoleSchema.index({ userId: 1, roleId: 1 }, { unique: true });