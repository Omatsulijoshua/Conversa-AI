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
exports.SpeechController = void 0;
const common_1 = require("@nestjs/common");
const speech_service_1 = require("./speech.service");
const tenant_auth_guard_1 = require("../auth/tenant-auth.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const platform_express_1 = require("@nestjs/platform-express");
let SpeechController = class SpeechController {
    speechService;
    constructor(speechService) {
        this.speechService = speechService;
    }
    stt(tenant, file) {
        return this.speechService.stt(tenant.id, file);
    }
    tts(tenant, body) {
        return this.speechService.tts(tenant.id, body.text, body.voiceId);
    }
};
exports.SpeechController = SpeechController;
__decorate([
    (0, common_1.Post)('stt'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio')),
    __param(0, (0, tenant_decorator_1.Tenant)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SpeechController.prototype, "stt", null);
__decorate([
    (0, common_1.Post)('tts'),
    __param(0, (0, tenant_decorator_1.Tenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SpeechController.prototype, "tts", null);
exports.SpeechController = SpeechController = __decorate([
    (0, common_1.Controller)('speech'),
    (0, common_1.UseGuards)(tenant_auth_guard_1.TenantAuthGuard),
    __metadata("design:paramtypes", [speech_service_1.SpeechService])
], SpeechController);
//# sourceMappingURL=speech.controller.js.map