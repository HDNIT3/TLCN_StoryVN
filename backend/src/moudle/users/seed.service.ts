import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { Role, RoleDocument } from './schemas/role.schema';
import { User, UserDocument } from './schemas/user.schema';
import { UserRole, UserRoleDocument } from './schemas/user-role.schema';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(UserRole.name)
    private readonly userRoleModel: Model<UserRoleDocument>,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Starting database seeding check...');
    try {
      await this.seedRolesAndAdmin();
      this.logger.log('Database seeding check completed successfully.');
    } catch (error) {
      this.logger.error('Error during database seeding:', error);
    }
  }

  private async seedRolesAndAdmin() {
    // 1. Seed Roles if empty
    const roleCount = await this.roleModel.countDocuments();
    if (roleCount === 0) {
      this.logger.log('Roles collection is empty. Seeding default roles...');
      const defaultRoles = [
        {
          name: 'READER',
          description: 'Người dùng - Đọc, tủ sách, lịch sử, like, follow, rating, comment, report.',
        },
        {
          name: 'AUTHOR',
          description: 'Tác giả - Quản lý truyện/chương, bản nháp, gửi duyệt, thống kê.',
        },
        {
          name: 'ADMIN',
          description: 'Quản trị viên - Kiểm duyệt, quản lý user/nội dung/report/thống kê.',
        },
      ];
      await this.roleModel.insertMany(defaultRoles);
      this.logger.log('Default roles seeded successfully.');
    } else {
      this.logger.log('Roles already exist. Skipping roles seeding.');
    }

    // Retrieve the ADMIN role document
    const adminRole = await this.roleModel.findOne({ name: 'ADMIN' });
    if (!adminRole) {
      this.logger.warn('ADMIN role could not be found in the database. Skipping admin user seed.');
      return;
    }

    // 2. Seed Admin User if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@storyvn.com';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    let adminUser = await this.userModel.findOne({ email: adminEmail });

    if (!adminUser) {
      this.logger.log(`Admin user not found. Creating default admin account (${adminEmail})...`);
      
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);

      adminUser = await new this.userModel({
        email: adminEmail,
        passwordHash,
        username: adminUsername,
        displayName: 'Quản trị viên',
        role: 'ADMIN',
        emailVerified: true,
        isActive: true,
        status: 'active',
      }).save();

      this.logger.log(`Default admin account created successfully. Default password: ${adminPassword}`);
    } else {
      this.logger.log(`Admin user with email ${adminEmail} already exists.`);
    }

    // 3. Link Admin User to Admin Role in UserRole if not linked
    const userRoleLink = await this.userRoleModel.findOne({
      userId: adminUser._id,
      roleId: adminRole._id,
    });

    if (!userRoleLink) {
      this.logger.log(`Linking admin user to ADMIN role...`);
      await new this.userRoleModel({
        userId: adminUser._id,
        roleId: adminRole._id,
      }).save();
      this.logger.log(`Linked admin user to ADMIN role in userroles collection.`);
    } else {
      this.logger.log(`Admin user is already linked to ADMIN role.`);
    }
  }
}
