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
exports.TenantAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let TenantAuthGuard = class TenantAuthGuard {
    prisma;
    jwt;
    config;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        if (apiKey) {
            const keyRecord = await this.prisma.apiKey.findUnique({
                where: { key: apiKey },
                include: { tenant: true },
            });
            if (!keyRecord)
                throw new common_1.UnauthorizedException('Invalid API Key');
            request.tenant = keyRecord.tenant;
            request.user = keyRecord.tenant;
            this.prisma.apiKey
                .update({ where: { id: keyRecord.id }, data: { lastUsed: new Date() } })
                .catch(err => console.error('Failed to update API Key lastUsed:', err));
            return true;
        }
        const authHeader = request.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!token)
            throw new common_1.UnauthorizedException('API key or bearer token is required');
        const payload = await this.jwt.verifyAsync(token, {
            secret: this.config.get('JWT_SECRET') || 'dev_secret_change_me',
        });
        const tenant = await this.prisma.tenant.findUnique({ where: { id: payload.sub } });
        if (!tenant)
            throw new common_1.UnauthorizedException('Invalid bearer token');
        request.tenant = tenant;
        request.user = tenant;
        return true;
    }
};
exports.TenantAuthGuard = TenantAuthGuard;
exports.TenantAuthGuard = TenantAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], TenantAuthGuard);
//# sourceMappingURL=tenant-auth.guard.js.map