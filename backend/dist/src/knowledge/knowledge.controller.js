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
exports.KnowledgeController = void 0;
const common_1 = require("@nestjs/common");
const knowledge_service_1 = require("./knowledge.service");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const prisma_service_1 = require("../prisma/prisma.service");
let KnowledgeController = class KnowledgeController {
    knowledgeService;
    prisma;
    constructor(knowledgeService, prisma) {
        this.knowledgeService = knowledgeService;
        this.prisma = prisma;
    }
    async createBase(req, agentId, data) {
        return this.prisma.knowledgeBase.create({
            data: {
                name: data.name,
                agentId,
                tenantId: req.user.id,
            },
        });
    }
    async getBases(agentId) {
        return this.prisma.knowledgeBase.findMany({
            where: { agentId },
            include: { _count: { select: { chunks: true } } },
        });
    }
    async uploadFile(id, file) {
        const content = file.buffer.toString('utf-8');
        await this.knowledgeService.ingestText(id, content, { filename: file.originalname });
        return { success: true };
    }
};
exports.KnowledgeController = KnowledgeController;
__decorate([
    (0, common_1.Post)(':agentId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('agentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], KnowledgeController.prototype, "createBase", null);
__decorate([
    (0, common_1.Get)(':agentId'),
    __param(0, (0, common_1.Param)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KnowledgeController.prototype, "getBases", null);
__decorate([
    (0, common_1.Post)(':id/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], KnowledgeController.prototype, "uploadFile", null);
exports.KnowledgeController = KnowledgeController = __decorate([
    (0, common_1.Controller)('knowledge'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [knowledge_service_1.KnowledgeService,
        prisma_service_1.PrismaService])
], KnowledgeController);
//# sourceMappingURL=knowledge.controller.js.map