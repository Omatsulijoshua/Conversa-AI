import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { OpenAI, toFile } from 'openai';
import { AiProviderService } from '../ai-provider/ai-provider.service';

@Injectable()
export class SpeechService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private aiProviders: AiProviderService,
  ) {}

  async stt(tenantId: string, audio: any) {
    const apiKey = await this.getOpenAiApiKey(tenantId);
    if (!apiKey) {
      throw new ServiceUnavailableException('OpenAI API key is required for speech-to-text');
    }
    const openai = new OpenAI({ apiKey });

    const file = await toFile(audio.buffer, audio.originalname || 'audio.wav', {
      type: audio.mimetype || 'audio/wav',
    });

    const transcription = await openai.audio.transcriptions.create({
      model: this.config.get<string>('OPENAI_STT_MODEL') || 'whisper-1',
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

  async tts(tenantId: string, text: string, voiceId?: string) {
    const apiKey = await this.getOpenAiApiKey(tenantId);
    if (!apiKey) {
      throw new ServiceUnavailableException('OpenAI API key is required for text-to-speech');
    }
    const openai = new OpenAI({ apiKey });

    const voice = voiceId || this.config.get<string>('OPENAI_TTS_VOICE') || 'alloy';
    const speech = await openai.audio.speech.create({
      model: this.config.get<string>('OPENAI_TTS_MODEL') || 'tts-1',
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

  private async getOpenAiApiKey(tenantId: string) {
    const active = await this.aiProviders.getActiveKey(tenantId);
    if (active?.provider === 'openai') return active.apiKey;
    return this.config.get<string>('OPENAI_API_KEY');
  }
}
