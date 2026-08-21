import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto, VerifyOtpDto, ResendOtpDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { RefreshToken, RefreshTokenDocument } from '../users/schemas/refresh-token.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    
    // Generate Access Token (expires in 15 minutes)
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    // Generate Refresh Token (expires in 7 days)
    const refreshToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
        expiresIn: '7d',
      },
    );

    // Save refresh token to database (using SHA-256 hash for fast indexing)
    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await new this.refreshTokenModel({
      userId,
      tokenHash,
      expiresAt,
    }).save();

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, username, password, role } = registerDto;

    const existingEmail = await this.usersService.findByEmail(email);
    if (existingEmail) {
      throw new BadRequestException('Email này đã được sử dụng.');
    }

    const existingUsername = await this.usersService.findByUsername(username);
    if (existingUsername) {
      throw new BadRequestException('Tên tài khoản này đã được sử dụng.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.usersService.create({
      email,
      username,
      displayName: username,
      passwordHash,
      role,
      isActive: false,
      emailVerified: false,
      status: 'inactive',
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.set(`otp:${email}`, otp, 300);
    await this.mailService.sendOtpEmail(email, otp);

    return {
      success: true,
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác thực OTP.',
      email: user.email,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;

    const cachedOtp = await this.redisService.get(`otp:${email}`);
    if (!cachedOtp) {
      throw new BadRequestException('Mã OTP đã hết hạn hoặc không tồn tại. Vui lòng yêu cầu gửi lại mã.');
    }

    if (cachedOtp !== otp) {
      throw new BadRequestException('Mã OTP không chính xác.');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }

    await this.usersService.update(user._id.toString(), {
      isActive: true,
      emailVerified: true,
      status: 'active',
    });

    await this.usersService.assignRole(user._id, user.role);
    await this.redisService.delete(`otp:${email}`);

    return {
      success: true,
      message: 'Xác thực tài khoản thành công! Tài khoản của bạn đã được kích hoạt.',
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const { email } = resendOtpDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản với email này.');
    }

    if (user.emailVerified && user.isActive) {
      throw new BadRequestException('Tài khoản đã được xác minh và kích hoạt trước đó.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.set(`otp:${email}`, otp, 300);
    await this.mailService.sendOtpEmail(email, otp);

    return {
      success: true,
      message: 'Mã OTP mới đã được gửi. Vui lòng kiểm tra hòm thư của bạn.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Email hoặc mật khẩu không chính xác.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Email hoặc mật khẩu không chính xác.');
    }

    // Check if account is active and verified
    if (!user.isActive || !user.emailVerified) {
      // Automatically generate a new OTP and send it
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await this.redisService.set(`otp:${email}`, otp, 300);
      await this.mailService.sendOtpEmail(email, otp);

      throw new BadRequestException({
        message: 'Tài khoản của bạn chưa được kích hoạt. Một mã OTP mới đã được gửi tới email của bạn.',
        requiresOtp: true,
        email: user.email,
      });
    }

    // Generate tokens
    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);

    return {
      success: true,
      message: 'Đăng nhập thành công.',
      ...tokens,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        status: user.status,
      },
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify signature of the refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
      });

      const tokenHash = this.hashToken(refreshToken);

      // Check database to see if token is valid and not revoked
      const tokenDoc = await this.refreshTokenModel.findOne({
        tokenHash,
        revoked: false,
      });

      if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
        throw new UnauthorizedException('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      // Find user
      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Tài khoản không tồn tại hoặc đã bị khóa.');
      }

      // Revoke old token
      await this.refreshTokenModel.deleteOne({ _id: tokenDoc._id });

      // Generate new tokens (Refresh Token Rotation)
      const newTokens = await this.generateTokens(user._id.toString(), user.email, user.role);

      return {
        success: true,
        ...newTokens,
      };
    } catch (err) {
      throw new UnauthorizedException('Phiên đăng nhập đã hết hạn hoặc không hợp lệ.');
    }
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin tài khoản.');
    }
    return {
      id: user._id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
    };
  }
}
