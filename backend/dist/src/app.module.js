"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const agent_module_1 = require("./agent/agent.module");
const conversation_module_1 = require("./conversation/conversation.module");
const speech_module_1 = require("./speech/speech.module");
const voice_module_1 = require("./voice/voice.module");
const analytics_module_1 = require("./analytics/analytics.module");
const webhook_module_1 = require("./webhook/webhook.module");
const billing_module_1 = require("./billing/billing.module");
const api_key_module_1 = require("./api-key/api-key.module");
const knowledge_module_1 = require("./knowledge/knowledge.module");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const ai_module_1 = require("./ai/ai.module");
const training_module_1 = require("./training/training.module");
const admin_dashboard_module_1 = require("./admin/admin-dashboard.module");
const ai_provider_module_1 = require("./ai-provider/ai-provider.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 10,
                }]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            agent_module_1.AgentModule,
            conversation_module_1.ConversationModule,
            speech_module_1.SpeechModule,
            voice_module_1.VoiceModule,
            analytics_module_1.AnalyticsModule,
            webhook_module_1.WebhookModule,
            billing_module_1.BillingModule,
            api_key_module_1.ApiKeyModule,
            knowledge_module_1.KnowledgeModule,
            ai_module_1.AiModule,
            training_module_1.TrainingModule,
            admin_dashboard_module_1.AdminDashboardModule,
            ai_provider_module_1.AiProviderModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map