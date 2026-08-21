import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/user.schema';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Role, RoleSchema } from './schemas/role.schema';
import { UserRole, UserRoleSchema } from './schemas/user-role.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: UserRole.name,
        schema: UserRoleSchema,
      },
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
      }
    ]),
  ],

  controllers: [UsersController],

  providers: [UsersService],

  exports: [UsersService],
})
export class UsersModule { }
