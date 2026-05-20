import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class WebhookService {
  constructor(private prisma: PrismaService) {}

  async dispatch(tenantId: string, event: string, payload: any) {
    const webhooks = await this.prisma.webhook.findMany({
      where: { 
        tenantId,
        events: { has: event },
      },
    });

    const promises = webhooks.map(async (webhook) => {
      try {
        await axios.post(webhook.url, {
          event,
          payload,
          timestamp: new Date().toISOString(),
        }, {
          headers: {
            'X-Conversa-Signature': 'mock_signature', // In production, sign the payload
          },
        });
      } catch (err) {
        console.error(`Failed to dispatch webhook to ${webhook.url}:`, err.message);
        // Implement retry logic or dead letter queue here
      }
    });

    await Promise.all(promises);
  }

  async register(tenantId: string, url: string, events: string[]) {
    return this.prisma.webhook.create({
      data: {
        tenantId,
        url,
        events,
      },
    });
  }

  async findByTenant(tenantId: string) {
    return this.prisma.webhook.findMany({
      where: { tenantId },
    });
  }

  async remove(tenantId: string, id: string) {
    return this.prisma.webhook.deleteMany({
      where: { id, tenantId },
    });
  }
}
