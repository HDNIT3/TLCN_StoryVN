import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  passwordHash: string;

  @Prop({
    required: true,
    trim: true,
  })
  username: string;

  @Prop({
    trim: true,
  })
  displayName: string;

  @Prop({
    default: '',
  })
  avatarUrl: string;

  @Prop({
    default: '',
  })
  bio: string;

  @Prop({
    default: 'active',
  })
  status: string;

  @Prop({
    default: false,
  })
  emailVerified: boolean;

  @Prop({
    default: 'USER',
  })
  role: string;

  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
