"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
let BillingService = class BillingService {
    prisma;
    config;
    stripe;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        const stripeSecret = this.config.get('STRIPE_SECRET_KEY');
        if (stripeSecret) {
            this.stripe = new stripe_1.default(stripeSecret, {
                apiVersion: '2025-01-27',
            });
        }
    }
    async createCheckoutSession(tenantId, priceId) {
        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant)
            throw new Error('Tenant not found');
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
    async handleWebhook(event) {
        console.log('Received Stripe event:', event.type);
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], BillingService);
//# sourceMappingURL=billing.service.js.map