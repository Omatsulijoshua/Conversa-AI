import { Controller, Post, Body, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SpeechService } from './speech.service';
import { TenantAuthGuard } from '../auth/tenant-auth.guard';
import { Tenant } from '../common/decorators/tenant.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('speech')
@UseGuards(TenantAuthGuard)
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}

  @Post('stt')
  @UseInterceptors(FileInterceptor('audio'))
  stt(@Tenant() tenant: any, @UploadedFile() file: Express.Multer.File) {
    return this.speechService.stt(tenant.id, file);
  }

  @Post('tts')
  tts(@Tenant() tenant: any, @Body() body: { text: string; voiceId?: string }) {
    return this.speechService.tts(tenant.id, body.text, body.voiceId);
  }
}
