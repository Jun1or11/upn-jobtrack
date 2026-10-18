import { Body, Controller, Delete, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { publicUser } from '../users/user.entity';
import { AuthService } from './auth.service';
import { AuthRequest, JwtGuard } from './jwt.guard';
import { DeleteAccountDto, EmailDto, LoginDto, RegisterDto, ResetPasswordDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('register') register(@Body() dto: RegisterDto) { return this.auth.register(dto); }
  @Post('login') @HttpCode(200) login(@Body() dto: LoginDto) { return this.auth.login(dto.email, dto.password); }
  @Get('me') @UseGuards(JwtGuard) me(@Req() req: AuthRequest) { return publicUser(req.user); }
  @Post('logout') @HttpCode(200) @UseGuards(JwtGuard)
  logout(@Req() req: AuthRequest) { return this.auth.logout(req.user.id); }
  @Post('forgot-password') @HttpCode(200)
  forgot(@Body() dto: EmailDto) { return this.auth.forgot(dto.email); }
  @Post('reset-password') @HttpCode(200)
  reset(@Body() dto: ResetPasswordDto) { return this.auth.reset(dto.token, dto.password); }
  @Delete('account') @UseGuards(JwtGuard)
  deleteAccount(@Req() req: AuthRequest, @Body() dto: DeleteAccountDto) {
    return this.auth.deleteAccount(req.user.id, dto.password);
  }
}
