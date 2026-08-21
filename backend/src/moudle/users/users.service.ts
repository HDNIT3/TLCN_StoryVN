import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { Role, RoleDocument } from './schemas/role.schema';
import { UserRole, UserRoleDocument } from './schemas/user-role.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    @InjectModel(UserRole.name)
    private readonly userRoleModel: Model<UserRoleDocument>,
  ) {}

  async findAll() {
    return this.userModel.find();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({
      username,
    });
  }

  async create(data: Partial<User>) {
    const user = new this.userModel(data);
    return user.save();
  }

  async update(id: string, data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async assignRole(userId: any, roleName: string) {
    const role = await this.roleModel.findOne({ name: roleName });
    if (!role) {
      throw new Error(`Role ${roleName} does not exist`);
    }

    const existingLink = await this.userRoleModel.findOne({
      userId,
      roleId: role._id,
    });

    if (!existingLink) {
      const userRole = new this.userRoleModel({
        userId,
        roleId: role._id,
      });
      await userRole.save();
    }
  }
}
