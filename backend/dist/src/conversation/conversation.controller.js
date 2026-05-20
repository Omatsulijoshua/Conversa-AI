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
exports.ConversationController = void 0;
const common_1 = require("@nestjs/common");
const conversation_service_1 = require("./conversation.service");
const tenant_auth_guard_1 = require("../auth/tenant-auth.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const swagger_1 = require("@nestjs/swagger");
let ConversationController = class ConversationController {
    conversationService;
    constructor(conversationService) {
        this.conversationService = conversationService;
    }
    start(tenant, body) {
        return this.conversationService.start(tenant.id, body.agentId);
    }
    message(tenant, body) {
        return this.conversationService.message(tenant.id, body.sessionId, body.message);
    }
    history(tenant, sessionId) {
        return this.conversationService.history(tenant.id, sessionId);
    }
};
exports.ConversationController = ConversationController;
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, tenant_decorator_1.Tenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ConversationController.prototype, "start", null);
__decorate([
    (0, common_1.Post)('message'),
    __param(0, (0, tenant_decorator_1.Tenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ConversationController.prototype, "message", null);
__decorate([
    (0, common_1.Get)('history/:sessionId'),
    __param(0, (0, tenant_decorator_1.Tenant)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ConversationController.prototype, "history", null);
exports.ConversationController = ConversationController = __decorate([
    (0, swagger_1.ApiTags)('Conversations'),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, common_1.Controller)('conversation'),
    (0, common_1.UseGuards)(tenant_auth_guard_1.TenantAuthGuard),
    __metadata("design:paramtypes", [conversation_service_1.ConversationService])
], ConversationController);
//# sourceMappingURL=conversation.controller.js.map