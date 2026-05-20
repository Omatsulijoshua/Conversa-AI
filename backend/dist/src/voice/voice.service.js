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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const crypto_1 = require("crypto");
let VoiceService = class VoiceService {
    config;
    elevenLabsUrl = 'https://api.elevenlabs.io/v1/voices/add';
    constructor(config) {
        this.config = config;
    }
    async cloneVoice(file, name, description = '') {
        const apiKey = this.config.get('ELEVENLABS_API_KEY');
        if (!apiKey) {
            return this.createLocalTrainingVoice(file, name);
        }
        const form = new form_data_1.default();
        form.append('name', name);
        form.append('description', description);
        form.append('files', file, { filename: 'voice_sample.webm', contentType: 'audio/webm' });
        const response = await axios_1.default.post(this.elevenLabsUrl, form, {
            headers: {
                ...form.getHeaders(),
                'xi-api-key': apiKey,
            },
        });
        return response.data;
    }
    createLocalTrainingVoice(file, name) {
        const hash = (0, crypto_1.createHash)('sha256')
            .update(file)
            .update(name)
            .digest('hex')
            .slice(0, 12);
        return {
            voice_id: `local-training-${hash}`,
            name,
            provider: 'local-training',
            status: 'ready_for_testing',
            message: 'No ElevenLabs API key is configured, so Conversa saved this as a local training voice for testing.',
        };
    }
};
exports.VoiceService = VoiceService;
exports.VoiceService = VoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], VoiceService);
//# sourceMappingURL=voice.service.js.map