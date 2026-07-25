"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookModule = void 0;
const common_1 = require("@nestjs/common");
const webhook_controller_1 = require("./webhook.controller");
const webhook_service_1 = require("./webhook.service");
const twilio_messaging_controller_1 = require("./twilio-messaging.controller");
const conversation_module_1 = require("../conversation/conversation.module");
let WebhookModule = class WebhookModule {
};
exports.WebhookModule = WebhookModule;
exports.WebhookModule = WebhookModule = __decorate([
    (0, common_1.Module)({
        imports: [conversation_module_1.ConversationModule],
        controllers: [webhook_controller_1.WebhookController, twilio_messaging_controller_1.TwilioMessagingController],
        providers: [webhook_service_1.WebhookService],
        exports: [webhook_service_1.WebhookService],
    })
], WebhookModule);
//# sourceMappingURL=webhook.module.js.map