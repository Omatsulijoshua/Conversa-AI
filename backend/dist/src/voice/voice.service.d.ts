import { ConfigService } from '@nestjs/config';
export declare class VoiceService {
    private config;
    private readonly elevenLabsUrl;
    constructor(config: ConfigService);
    cloneVoice(file: Buffer, name: string, description?: string): Promise<any>;
    private createLocalTrainingVoice;
}
