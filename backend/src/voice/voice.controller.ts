import { BadRequestException, Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { VoiceService } from './voice.service';

@Controller('voice')
@UseGuards(AuthGuard('jwt'))
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Get()
  async listVoices() {
    return this.voiceService.listVoices();
  }

  @Post('clone')
  @UseInterceptors(FileInterceptor('file'))
  async cloneVoice(
    @UploadedFile() file: any,
    @Body('name') name: string,
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('Please upload or record a voice sample.');
    }
    if (!name?.trim()) {
      throw new BadRequestException('Please give the voice a name.');
    }
    const result = await this.voiceService.cloneVoice(file.buffer, name);
    
    // You could also save this voiceId to the tenant or a new table for cloned voices
    // For now, we return it to the frontend
    return {
      success: true,
      voiceId: result.voice_id,
      name: name,
      provider: result.provider || 'elevenlabs',
      status: result.status || 'cloned',
      message: result.message || 'Voice cloned successfully.',
    };
  }
}
