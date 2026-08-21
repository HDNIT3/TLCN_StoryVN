import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });
      this.logger.log('SMTP mail transporter initialized.');
    } else {
      this.logger.warn(
        'SMTP configurations not completely set. MailService will fall back to terminal logging.',
      );
    }
  }

  async sendOtpEmail(to: string, otp: string) {
    const from = process.env.SMTP_FROM || '"StoryVN Support" <no-reply@storyvn.com>';
    const subject = '[StoryVN] Xác nhận đăng ký tài khoản - Mã OTP';
    const text = `Xin chào,\n\nBạn đã đăng ký tài khoản tại StoryVN.\nMã OTP xác thực của bạn là: ${otp}\nMã này có hiệu lực trong 5 phút.\n\nNếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.\n\nTrân trọng,\nStoryVN Team`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4F46E5; text-align: center;">Xác nhận tài khoản StoryVN</h2>
        <p>Xin chào,</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>StoryVN</strong>. Dưới đây là mã xác thực OTP của bạn:</p>
        <div style="background-color: #F3F4F6; font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; padding: 15px; margin: 20px 0; border-radius: 8px; color: #111827;">
          ${otp}
        </div>
        <p style="color: #6B7280; font-size: 14px;">Mã xác thực này sẽ hết hạn sau <strong>5 phút</strong>.</p>
        <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="text-align: center; color: #9CA3AF; font-size: 12px;">© 2026 StoryVN. All rights reserved.</p>
      </div>
    `;

    this.logger.log(`-----------------------------------------`);
    this.logger.log(`[MAIL RESCUE] Gửi OTP cho ${to}`);
    this.logger.log(`[MAIL RESCUE] MÃ OTP XÁC THỰC: ${otp}`);
    this.logger.log(`-----------------------------------------`);

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from,
          to,
          subject,
          text,
          html,
        });
        this.logger.log(`Email verification sent successfully to ${to}`);
      } catch (error) {
        this.logger.error(`Failed to send email to ${to}:`, error);
      }
    }
  }
}
