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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUsage(tenantId) {
        const usage = await this.prisma.usage.groupBy({
            by: ['metric'],
            where: { tenantId },
            _sum: {
                quantity: true,
            },
        });
        return usage.map(u => ({
            metric: u.metric,
            total: u._sum.quantity,
        }));
    }
    async getCalls(tenantId) {
        return this.prisma.call.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: { agent: true },
        });
    }
    async getPerformance(tenantId) {
        return {
            avgLatency: '142ms',
            successRate: '98.5%',
            avgDuration: '2.4 mins',
        };
    }
    async getUsageOverTime(tenantId) {
        return [
            { name: 'Mon', requests: 400, minutes: 240 },
            { name: 'Tue', requests: 300, minutes: 139 },
            { name: 'Wed', requests: 200, minutes: 980 },
            { name: 'Thu', requests: 278, minutes: 390 },
            { name: 'Fri', requests: 189, minutes: 480 },
            { name: 'Sat', requests: 239, minutes: 380 },
            { name: 'Sun', requests: 349, minutes: 430 },
        ];
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map