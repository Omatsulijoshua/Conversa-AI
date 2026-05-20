"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(data) {
        const existing = await this.prisma.tenant.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const tenant = await this.prisma.tenant.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
        });
        const apiKey = await this.prisma.apiKey.create({
            data: {
                key: `cv_${Math.random().toString(36).substring(2, 15)}`,
                name: 'Default Key',
                tenantId: tenant.id,
            },
        });
        return {
            access_token: this.jwtService.sign({ sub: tenant.id, email: tenant.email }),
            tenant: { id: tenant.id, name: tenant.name, email: tenant.email },
            apiKey: apiKey.key,
        };
    }
    async login(data) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { email: data.email },
        });
        if (!tenant || !tenant.password || !(await bcrypt.compare(data.password, tenant.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: tenant.id, email: tenant.email };
        return {
            access_token: this.jwtService.sign(payload),
            tenant: { id: tenant.id, name: tenant.name, email: tenant.email },
        };
    }
    async googleLogin(req) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('No user from google');
        }
        let tenant = await this.prisma.tenant.findUnique({
            where: { email: req.user.email },
        });
        if (!tenant) {
            tenant = await this.prisma.tenant.create({
                data: {
                    name: `${req.user.firstName} ${req.user.lastName}`,
                    email: req.user.email,
                    password: null,
                },
            });
            await this.prisma.apiKey.create({
                data: {
                    key: `cv_${Math.random().toString(36).substring(2, 15)}`,
                    name: 'Default Key',
                    tenantId: tenant.id,
                },
            });
        }
        const payload = { sub: tenant.id, email: tenant.email };
        return {
            access_token: this.jwtService.sign(payload),
            tenant: { id: tenant.id, name: tenant.name, email: tenant.email },
        };
    }
    async validateTenant(payload) {
        return this.prisma.tenant.findUnique({ where: { id: payload.sub } });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map