import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { BillingService } from './billing.service';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { Tenant } from '../common/decorators/tenant.decorator';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout')
  @UseGuards(ApiKeyGuard)
  createCheckout(@Tenant() tenant: any, @Body() body: { priceId: string }) {
    return this.billingService.createCheckoutSession(tenant.id, body.priceId);
  }

  @Post('webhook')
  handleWebhook(@Req() req: any) {
    return this.billingService.handleWebhook(req.body);
  }
}
