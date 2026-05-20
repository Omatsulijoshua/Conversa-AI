import { SpeechService } from './speech.service';
export declare class SpeechController {
    private readonly speechService;
    constructor(speechService: SpeechService);
    stt(tenant: any, file: Express.Multer.File): Promise<{
        transcript: string;
    }>;
    tts(tenant: any, body: {
        text: string;
        voiceId?: string;
    }): Promise<{
        audioUrl: string;
        audioBase64: string;
        mimeType: string;
    }>;
}
