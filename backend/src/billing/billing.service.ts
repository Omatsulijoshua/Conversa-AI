import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
  private stripe: InstanceType<typeof Stripe>;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    const stripeSecret = this.config.get<string>('STRIPE_SECRET_KEY');
    if (stripeSecret) {
      this.stripe = new Stripe(stripeSecret, {
        apiVersion: '2025-01-27' as any,
      });
    }
  }

  async createCheckoutSession(tenantId: string, priceId: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new Error('Tenant not found');

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${this.config.get('FRONTEND_URL')}/billing?success=true`,
      cancel_url: `${this.config.get('FRONTEND_URL')}/billing?canceled=true`,
      client_reference_id: tenantId,
      customer_email: tenant.email,
    });

    return { url: session.url };
  }

  async handleWebhook(event: any) {
    // Handle Stripe webhook events (e.g., subscription.created, invoice.paid)
    console.log('Received Stripe event:', event.type);
  }
}
