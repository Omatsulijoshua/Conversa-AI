import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AiProviderService } from '../ai-provider/ai-provider.service';
export declare class SpeechService {
    private prisma;
    private config;
    private aiProviders;
    constructor(prisma: PrismaService, config: ConfigService, aiProviders: AiProviderService);
    stt(tenantId: string, audio: any): Promise<{
        transcript: string;
    }>;
    tts(tenantId: string, text: string, voiceId?: string): Promise<{
        audioUrl: string;
        audioBase64: string;
        mimeType: string;
    }>;
    private getOpenAiApiKey;
}
