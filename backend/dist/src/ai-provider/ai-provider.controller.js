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
exports.AiProviderController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const ai_provider_service_1 = require("./ai-provider.service");
let AiProviderController = class AiProviderController {
    aiProviderService;
    constructor(aiProviderService) {
        this.aiProviderService = aiProviderService;
    }
    list(req) {
        return this.aiProviderService.list(req.user.id);
    }
    createOrUpdate(req, body) {
        return this.aiProviderService.createOrUpdate(req.user.id, body);
    }
    setActive(req, id) {
        return this.aiProviderService.setActive(req.user.id, id);
    }
    remove(req, id) {
        return this.aiProviderService.remove(req.user.id, id);
    }
};
exports.AiProviderController = AiProviderController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiProviderController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AiProviderController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.Patch)(':id/active'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AiProviderController.prototype, "setActive", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AiProviderController.prototype, "remove", null);
exports.AiProviderController = AiProviderController = __decorate([
    (0, common_1.Controller)('ai-providers'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [ai_provider_service_1.AiProviderService])
], AiProviderController);
//# sourceMappingURL=ai-provider.controller.js.map