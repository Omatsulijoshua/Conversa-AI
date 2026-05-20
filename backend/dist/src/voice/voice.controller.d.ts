import { VoiceService } from './voice.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class VoiceController {
    private readonly voiceService;
    private prisma;
    constructor(voiceService: VoiceService, prisma: PrismaService);
    cloneVoice(file: any, name: string, req: any): Promise<{
        success: boolean;
        voiceId: any;
        name: string;
        provider: any;
        status: any;
        message: any;
    }>;
}
