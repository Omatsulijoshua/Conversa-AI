import { Controller, Get, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminDashboardService } from './admin-dashboard.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller('admin')
export class AdminDashboardController {
  constructor(
    private readonly adminDashboardService: AdminDashboardService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;
    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    // 1. Find admin in database
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Validate password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Return the admin dashboard token
    const token = this.config.get<string>('ADMIN_DASHBOARD_TOKEN') || 'admin_password';
    return { token };
  }

  @Get('overview')
  getOverview(@Headers('x-admin-token') adminToken?: string) {
    const expectedToken = this.config.get<string>('ADMIN_DASHBOARD_TOKEN');
    if (expectedToken && adminToken !== expectedToken) {
      throw new UnauthorizedException('Invalid admin dashboard token');
    }

    return this.adminDashboardService.getOverview();
  }
}
