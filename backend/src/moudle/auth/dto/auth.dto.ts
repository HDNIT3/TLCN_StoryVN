import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn, Length } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string;

  @IsString({ message: 'Tên tài khoản phải là chuỗi ký tự.' })
  @MinLength(3, { message: 'Tên tài khoản phải chứa ít nhất 3 ký tự.' })
  @IsNotEmpty({ message: 'Tên tài khoản không được để trống.' })
  username: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự.' })
  @MinLength(6, { message: 'Mật khẩu phải chứa ít nhất 6 ký tự.' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  password: string;

  @IsNotEmpty({ message: 'Vai trò không được để trống.' })
  @IsIn(['READER', 'AUTHOR'], { message: 'Vai trò chỉ có thể là READER (Đọc giả) hoặc AUTHOR (Tác giả).' })
  role: string;
}

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string;

  @IsNotEmpty({ message: 'Mã OTP không được để trống.' })
  @Length(6, 6, { message: 'Mã OTP phải có đúng 6 ký tự.' })
  otp: string;
}

export class ResendOtpDto {
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  password: string;
}

export class RefreshTokenDto {
  @IsString({ message: 'Refresh token phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Refresh token không được để trống.' })
  refreshToken: string;
}
