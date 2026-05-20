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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin_dashboard_service_1 = require("./admin-dashboard.service");
let AdminDashboardController = class AdminDashboardController {
    adminDashboardService;
    config;
    constructor(adminDashboardService, config) {
        this.adminDashboardService = adminDashboardService;
        this.config = config;
    }
    getOverview(adminToken) {
        const expectedToken = this.config.get('ADMIN_DASHBOARD_TOKEN');
        if (expectedToken && adminToken !== expectedToken) {
            throw new common_1.UnauthorizedException('Invalid admin dashboard token');
        }
        return this.adminDashboardService.getOverview();
    }
};
exports.AdminDashboardController = AdminDashboardController;
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Headers)('x-admin-token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminDashboardController.prototype, "getOverview", null);
exports.AdminDashboardController = AdminDashboardController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_dashboard_service_1.AdminDashboardService,
        config_1.ConfigService])
], AdminDashboardController);
//# sourceMappingURL=admin-dashboard.controller.js.map