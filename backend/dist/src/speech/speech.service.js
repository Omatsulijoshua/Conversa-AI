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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
const ai_provider_service_1 = require("../ai-provider/ai-provider.service");
let SpeechService = class SpeechService {
    prisma;
    config;
    aiProviders;
    constructor(prisma, config, aiProviders) {
        this.prisma = prisma;
        this.config = config;
        this.aiProviders = aiProviders;
    }
    async stt(tenantId, audio) {
        const apiKey = await this.getOpenAiApiKey(tenantId);
        if (!apiKey) {
            throw new common_1.ServiceUnavailableException('OpenAI API key is required for speech-to-text');
        }
        const openai = new openai_1.OpenAI({ apiKey });
        const file = await (0, openai_1.toFile)(audio.buffer, audio.originalname || 'audio.wav', {
            type: audio.mimetype || 'audio/wav',
        });
        const transcription = await openai.audio.transcriptions.create({
            model: this.config.get('OPENAI_STT_MODEL') || 'whisper-1',
            file,
        });
        const transcript = transcription.text;
        await this.prisma.usage.create({
            data: {
                tenantId,
                metric: 'stt_seconds',
                quantity: 0,
            },
        });
        return { transcript };
    }
    async tts(tenantId, text, voiceId) {
        const apiKey = await this.getOpenAiApiKey(tenantId);
        if (!apiKey) {
            throw new common_1.ServiceUnavailableException('OpenAI API key is required for text-to-speech');
        }
        const openai = new openai_1.OpenAI({ apiKey });
        const voice = voiceId || this.config.get('OPENAI_TTS_VOICE') || 'alloy';
        const speech = await openai.audio.speech.create({
            model: this.config.get('OPENAI_TTS_MODEL') || 'tts-1',
            voice,
            input: text,
        });
        const bytes = Buffer.from(await speech.arrayBuffer());
        const audioBase64 = bytes.toString('base64');
        const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
        await this.prisma.usage.create({
            data: {
                tenantId,
                metric: 'tts_chars',
                quantity: text.length,
            },
        });
        return { audioUrl, audioBase64, mimeType: 'audio/mpeg' };
    }
    async getOpenAiApiKey(tenantId) {
        const active = await this.aiProviders.getActiveKey(tenantId);
        if (active?.provider === 'openai')
            return active.apiKey;
        return this.config.get('OPENAI_API_KEY');
    }
};
exports.SpeechService = SpeechService;
exports.SpeechService = SpeechService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        ai_provider_service_1.AiProviderService])
], SpeechService);
//# sourceMappingURL=speech.service.js.map