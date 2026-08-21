import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
    timestamps: true,
})
export class Role {
    @Prop({
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    })
    name: string; // 'ADMIN', 'USER', 'AUTHOR'

    @Prop({ default: '', trim: true })
    description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);