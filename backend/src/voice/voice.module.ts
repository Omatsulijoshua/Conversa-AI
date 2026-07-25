import { Module } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { VoiceController } from './voice.controller';
import { VoiceTelephonyController } from './voice-telephony.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [PrismaModule, ConversationModule],
  controllers: [VoiceController, VoiceTelephonyController],
  providers: [VoiceService],
  exports: [VoiceService],
})
export class VoiceModule {}
