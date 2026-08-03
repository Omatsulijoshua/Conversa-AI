import { Injectable } from '@nestjs/common';
import { AiProviderService } from '../ai-provider/ai-provider.service';
import { OPENAI_COMPATIBLE_BASE_URLS } from '../ai-provider/ai-provider.constants';

type ChatRole = 'system' | 'user' | 'assistant';

@Injectable()
export class AiService {
  constructor(private aiProviders: AiProviderService) {}

  async reply(params: {
    tenantId: string;
    agent: { name: string; tone?: string | null; industry?: string | null; instructions?: string | null };
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    knowledgeContext?: string | null;
    modelName?: string | null;
    temperature?: number | null;
  }): Promise<string> {
    const providerKey = await this.aiProviders.getActiveKey(params.tenantId);
    if (!providerKey) {
      return this.localSupportReply(params.messages.at(-1)?.content || '', params.knowledgeContext);
    }

    const system = this.buildSystemPrompt(params.agent, params.knowledgeContext ?? null);
    const inputMessages: Array<{ role: ChatRole; content: string }> = [
      { role: 'system', content: system },
      ...params.messages.map(m => ({ role: m.role, content: m.content })),
    ];

    const response = await this.callProvider(providerKey, inputMessages, params.modelName, params.temperature);
    await this.aiProviders.markUsed(providerKey.id);
    return response || this.localSupportReply(params.messages.at(-1)?.content || '', params.knowledgeContext);
  }

  private async callProvider(
    providerKey: {
      provider: string;
      apiKey: string;
      modelName: string | null;
      baseUrl: string | null;
    },
    messages: Array<{ role: ChatRole; content: string }>,
    modelOverride?: string | null,
    tempOverride?: number | null,
  ) {
    if (providerKey.provider === 'gemini') {
      return this.callGemini(providerKey, messages, modelOverride, tempOverride);
    }

    if (providerKey.provider === 'anthropic') {
      return this.callAnthropic(providerKey, messages, modelOverride, tempOverride);
    }

    return this.callOpenAiCompatible(providerKey, messages, modelOverride, tempOverride);
  }

  private async callOpenAiCompatible(
    providerKey: { provider: string; apiKey: string; modelName: string | null; baseUrl: string | null },
    messages: Array<{ role: ChatRole; content: string }>,
    modelOverride?: string | null,
    tempOverride?: number | null,
  ) {
    const baseUrl = providerKey.baseUrl || OPENAI_COMPATIBLE_BASE_URLS[providerKey.provider as keyof typeof OPENAI_COMPATIBLE_BASE_URLS];
    const model = modelOverride || providerKey.modelName || 'gpt-4o-mini';
    const temperature = tempOverride !== undefined && tempOverride !== null ? tempOverride : 0.4;
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${providerKey.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI provider ${providerKey.provider} failed: ${await response.text()}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  }

  private async callGemini(
    providerKey: { apiKey: string; modelName: string | null },
    messages: Array<{ role: ChatRole; content: string }>,
    modelOverride?: string | null,
    tempOverride?: number | null,
  ) {
    const system = messages.find(message => message.role === 'system')?.content;
    const contents = messages
      .filter(message => message.role !== 'system')
      .map(message => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content }],
      }));

    const model = modelOverride || providerKey.modelName || 'gemini-1.5-flash';
    const temperature = tempOverride !== undefined && tempOverride !== null ? tempOverride : 0.4;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${providerKey.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        contents,
        generationConfig: { temperature },
      }),
    });

    if (!response.ok) {
      throw new Error(`AI provider gemini failed: ${await response.text()}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('').trim() || '';
  }

  private async callAnthropic(
    providerKey: { apiKey: string; modelName: string | null },
    messages: Array<{ role: ChatRole; content: string }>,
    modelOverride?: string | null,
    tempOverride?: number | null,
  ) {
    const system = messages.find(message => message.role === 'system')?.content;
    const anthropicMessages = messages
      .filter(message => message.role !== 'system')
      .map(message => ({ role: message.role, content: message.content }));

    const model = modelOverride || providerKey.modelName || 'claude-3-5-haiku-latest';
    const temperature = tempOverride !== undefined && tempOverride !== null ? tempOverride : 0.4;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': providerKey.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 800,
        temperature,
        ...(system ? { system } : {}),
        messages: anthropicMessages,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI provider anthropic failed: ${await response.text()}`);
    }

    const data = await response.json();
    return data.content?.map((part: { text?: string }) => part.text ?? '').join('').trim() || '';
  }

  private localSupportReply(message: string, knowledgeContext?: string | null) {
    const lower = message.toLowerCase();
    if (lower.includes('refund')) {
      return 'I can help with that. Please share the order number and the email on the purchase, and I will check whether it is eligible for refund review within 2 business days.';
    }
    if (lower.includes('password') || lower.includes('login') || lower.includes('account')) {
      return 'I can help you get back in. Please confirm the email on the account, then use the password reset link. I will never ask for your full password.';
    }
    if (lower.includes('angry') || lower.includes('fraud') || lower.includes('legal')) {
      return 'I understand this needs careful handling. I am going to escalate this to a human specialist and summarize the issue so you do not have to repeat yourself.';
    }
    if (knowledgeContext) {
      return 'Thanks for explaining. Based on our support policy, the next best step is to confirm the details, summarize the issue, and guide you through one clear action at a time.';
    }
    return 'Thanks for reaching out. I can help with refunds, account access, basic troubleshooting, or escalation to a human when the issue needs extra care.';
  }

  private buildSystemPrompt(
    agent: { name: string; tone?: string | null; industry?: string | null; instructions?: string | null },
    knowledgeContext: string | null,
  ) {
    const parts: string[] = [
      `You are "${agent.name}", a voice customer support agent.`,
      'Sound human, concise, and helpful.',
      'Ask one clarifying question at a time when needed.',
      'Do not mention being an AI, model, or system.',
    ];

    if (agent.tone) parts.push(`Tone: ${agent.tone}.`);
    if (agent.industry) parts.push(`Industry: ${agent.industry}.`);
    if (agent.instructions) parts.push(`Company instructions:\n${agent.instructions}`);

    if (knowledgeContext) {
      parts.push(`Knowledge base context (use if relevant):\n${knowledgeContext}`);
    }

    return parts.join('\n\n');
  }
}
