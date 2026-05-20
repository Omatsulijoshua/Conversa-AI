import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import FormData from 'form-data';
import { createHash } from 'crypto';

@Injectable()
export class VoiceService {
  private readonly elevenLabsUrl = 'https://api.elevenlabs.io/v1/voices/add';

  constructor(private config: ConfigService) {}

  async cloneVoice(file: Buffer, name: string, description: string = '') {
    const apiKey = this.config.get<string>('ELEVENLABS_API_KEY');
    if (!apiKey) {
      return this.createLocalTrainingVoice(file, name);
    }

    const form = new FormData();
    form.append('name', name);
    form.append('description', description);
    form.append('files', file, { filename: 'voice_sample.webm', contentType: 'audio/webm' });

    const response = await axios.post(this.elevenLabsUrl, form, {
      headers: {
        ...form.getHeaders(),
        'xi-api-key': apiKey,
      },
    });

    return response.data; // contains voice_id
  }

  private createLocalTrainingVoice(file: Buffer, name: string) {
    const hash = createHash('sha256')
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
}
