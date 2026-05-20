import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('usage')
  getUsage(@Req() req: Request) {
    return this.analyticsService.getUsage((req.user as any).id);
  }

  @Get('usage/series')
  getUsageSeries(@Req() req: Request) {
    return this.analyticsService.getUsageOverTime((req.user as any).id);
  }

  @Get('calls')
  getCalls(@Req() req: Request) {
    return this.analyticsService.getCalls((req.user as any).id);
  }

  @Get('performance')
  getPerformance(@Req() req: Request) {
    return this.analyticsService.getPerformance((req.user as any).id);
  }
}
