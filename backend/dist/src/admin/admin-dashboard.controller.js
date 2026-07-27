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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin_dashboard_service_1 = require("./admin-dashboard.service");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AdminDashboardController = class AdminDashboardController {
    adminDashboardService;
    config;
    prisma;
    constructor(adminDashboardService, config, prisma) {
        this.adminDashboardService = adminDashboardService;
        this.config = config;
        this.prisma = prisma;
    }
    async login(body) {
        const { email, password } = body;
        if (!email || !password) {
            throw new common_1.UnauthorizedException('Email and password are required');
        }
        const admin = await this.prisma.admin.findUnique({
            where: { email },
        });
        if (!admin) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const token = this.config.get('ADMIN_DASHBOARD_TOKEN') || 'admin_password';
        return { token };
    }
    getOverview(adminToken) {
        const expectedToken = this.config.get('ADMIN_DASHBOARD_TOKEN');
        if (expectedToken && adminToken !== expectedToken) {
            throw new common_1.UnauthorizedException('Invalid admin dashboard token');
        }
        return this.adminDashboardService.getOverview();
    }
    getDevelopers(adminToken) {
        const expectedToken = this.config.get('ADMIN_DASHBOARD_TOKEN');
        if (expectedToken && adminToken !== expectedToken) {
            throw new common_1.UnauthorizedException('Invalid admin dashboard token');
        }
        return this.adminDashboardService.getDevelopers();
    }
    updateDeveloper(id, body, adminToken) {
        const expectedToken = this.config.get('ADMIN_DASHBOARD_TOKEN');
        if (expectedToken && adminToken !== expectedToken) {
            throw new common_1.UnauthorizedException('Invalid admin dashboard token');
        }
        const { plan, usageLimit } = body;
        return this.adminDashboardService.updateDeveloper(id, plan, Number(usageLimit));
    }
};
exports.AdminDashboardController = AdminDashboardController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Headers)('x-admin-token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminDashboardController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('developers'),
    __param(0, (0, common_1.Headers)('x-admin-token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminDashboardController.prototype, "getDevelopers", null);
__decorate([
    (0, common_1.Put)('developers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-admin-token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], AdminDashboardController.prototype, "updateDeveloper", null);
exports.AdminDashboardController = AdminDashboardController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_dashboard_service_1.AdminDashboardService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], AdminDashboardController);
//# sourceMappingURL=admin-dashboard.controller.js.map