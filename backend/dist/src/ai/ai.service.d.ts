import { AiProviderService } from '../ai-provider/ai-provider.service';
export declare class AiService {
    private aiProviders;
    constructor(aiProviders: AiProviderService);
    reply(params: {
        tenantId: string;
        agent: {
            name: string;
            tone?: string | null;
            industry?: string | null;
            instructions?: string | null;
        };
        messages: Array<{
            role: 'user' | 'assistant';
            content: string;
        }>;
        knowledgeContext?: string | null;
        modelName?: string | null;
        temperature?: number | null;
    }): Promise<string>;
    private callProvider;
    private callOpenAiCompatible;
    private callGemini;
    private callAnthropic;
    private localSupportReply;
    private buildSystemPrompt;
}
