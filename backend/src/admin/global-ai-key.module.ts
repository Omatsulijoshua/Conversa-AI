import { Module } from '@nestjs/common';
import { GlobalAiKeyService } from './global-ai-key.service';
import { GlobalAiKeyController } from './global-ai-key.controller';

@Module({
  controllers: [GlobalAiKeyController],
  providers: [GlobalAiKeyService],
  exports: [GlobalAiKeyService],
})
export class GlobalAiKeyModule {}
