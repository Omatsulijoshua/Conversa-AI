import { BillingService } from './billing.service';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    createCheckout(tenant: any, body: {
        priceId: string;
    }): Promise<{
        url: string | null;
    }>;
    handleWebhook(req: any): Promise<void>;
}
