import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class BillingService {
    private prisma;
    private config;
    private stripe;
    constructor(prisma: PrismaService, config: ConfigService);
    createCheckoutSession(tenantId: string, priceId: string): Promise<{
        url: string | null;
    }>;
    handleWebhook(event: any): Promise<void>;
}
