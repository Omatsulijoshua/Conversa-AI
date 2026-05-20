import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminDashboardService } from './admin-dashboard.service';

@Controller('admin')
export class AdminDashboardController {
  constructor(
    private readonly adminDashboardService: AdminDashboardService,
    private readonly config: ConfigService,
  ) {}

  @Get('overview')
  getOverview(@Headers('x-admin-token') adminToken?: string) {
    const expectedToken = this.config.get<string>('ADMIN_DASHBOARD_TOKEN');
    if (expectedToken && adminToken !== expectedToken) {
      throw new UnauthorizedException('Invalid admin dashboard token');
    }

    return this.adminDashboardService.getOverview();
  }
}

