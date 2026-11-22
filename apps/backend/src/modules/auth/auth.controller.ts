import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller(['api/v1/auth', 'auth'])
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * AUTH-01: Đăng nhập quản trị
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password?: string }, @Req() req: any) {
    const ip = req?.ip || req?.socket?.remoteAddress || '127.0.0.1';
    return await this.authService.login(body.email, body.password || '', ip);
  }

  /**
   * AUTH-02: Xác thực hai lớp (TOTP / OTP 6 chữ số)
   */
  @Post(['2fa/verify', 'verify-2fa'])
  @HttpCode(HttpStatus.OK)
  async verify2FA(
    @Body() body: { email: string; code: string; challenge_id?: string },
    @Req() req: any,
  ) {
    const ip = req?.ip || req?.socket?.remoteAddress || '127.0.0.1';
    return await this.authService.verify2FA(body.email, body.code, body.challenge_id, ip);
  }

  /**
   * Tạo thông tin thiết lập 2FA (Secret, QR, backup codes)
   */
  @Post('2fa/setup')
  @HttpCode(HttpStatus.OK)
  async setup2FA(@Body() body: { email?: string }) {
    return {
      success: true,
      secret: 'JBSWY3DPEHPK3PXP',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/TechZone:admin@techzone.vn?secret=JBSWY3DPEHPK3PXP&issuer=TechZone',
      backupCodes: ['892410', '192837', '482019', '593820', '391029'],
    };
  }

  /**
   * AUTH-03: Nạp vai trò và quyền hạn
   */
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: any) {
    const email = req?.user?.email || 'admin@techzone.vn';
    return await this.authService.getMe(email);
  }

  /**
   * AUTH-04: Làm mới Token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refresh_token') refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }

  /**
   * AUTH-05: Đăng xuất, thu hồi phiên
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('refresh_token') refreshToken?: string) {
    return await this.authService.logout(refreshToken);
  }

  /**
   * AUTH-08: Quên mật khẩu
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.forgotPassword(email);
  }

  /**
   * AUTH-08: Đặt lại mật khẩu
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token?: string; new_password?: string; otp?: string }) {
    return await this.authService.resetPassword({
      token: body.token,
      newPassword: body.new_password,
      otp: body.otp,
    });
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: { fullName: string; email: string; password?: string; phone?: string }) {
    return await this.authService.register(body);
  }

  @Post('social-login')
  @HttpCode(HttpStatus.OK)
  async socialLogin(@Body() body: { provider: string; email?: string; fullName?: string }) {
    return await this.authService.socialLogin(body.provider, body.email, body.fullName);
  }
}
