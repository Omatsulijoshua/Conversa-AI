"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalAiKeyModule = void 0;
const common_1 = require("@nestjs/common");
const global_ai_key_service_1 = require("./global-ai-key.service");
const global_ai_key_controller_1 = require("./global-ai-key.controller");
let GlobalAiKeyModule = class GlobalAiKeyModule {
};
exports.GlobalAiKeyModule = GlobalAiKeyModule;
exports.GlobalAiKeyModule = GlobalAiKeyModule = __decorate([
    (0, common_1.Module)({
        controllers: [global_ai_key_controller_1.GlobalAiKeyController],
        providers: [global_ai_key_service_1.GlobalAiKeyService],
        exports: [global_ai_key_service_1.GlobalAiKeyService],
    })
], GlobalAiKeyModule);
//# sourceMappingURL=global-ai-key.module.js.map