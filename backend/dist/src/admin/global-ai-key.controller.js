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
exports.GlobalAiKeyController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const global_ai_key_service_1 = require("./global-ai-key.service");
let GlobalAiKeyController = class GlobalAiKeyController {
    service;
    config;
    constructor(service, config) {
        this.service = service;
        this.config = config;
    }
    verifyToken(adminToken) {
        const expectedToken = this.config.get('ADMIN_DASHBOARD_TOKEN');
        if (expectedToken && adminToken !== expectedToken) {
            throw new common_1.UnauthorizedException('Invalid admin dashboard token');
        }
    }
    async list(adminToken) {
        this.verifyToken(adminToken);
        return this.service.list();
    }
    async create(body, adminToken) {
        this.verifyToken(adminToken);
        return this.service.create(body);
    }
    async remove(id, adminToken) {
        this.verifyToken(adminToken);
        return this.service.remove(id);
    }
    async toggleActive(id, adminToken) {
        this.verifyToken(adminToken);
        return this.service.toggleActive(id);
    }
    async updateStrategy(body, adminToken) {
        this.verifyToken(adminToken);
        return this.service.updateStrategy(body.strategy);
    }
};
exports.GlobalAiKeyController = GlobalAiKeyController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('x-admin-token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GlobalAiKeyController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-admin-token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GlobalAiKeyController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('x-admin-token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GlobalAiKeyController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/toggle'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('x-admin-token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GlobalAiKeyController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Post)('strategy'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-admin-token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GlobalAiKeyController.prototype, "updateStrategy", null);
exports.GlobalAiKeyController = GlobalAiKeyController = __decorate([
    (0, common_1.Controller)('admin/global-keys'),
    __metadata("design:paramtypes", [global_ai_key_service_1.GlobalAiKeyService,
        config_1.ConfigService])
], GlobalAiKeyController);
//# sourceMappingURL=global-ai-key.controller.js.map