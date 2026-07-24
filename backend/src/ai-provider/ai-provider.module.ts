import { Module } from '@nestjs/common';
import { AiProviderController } from './ai-provider.controller';
import { AiProviderService } from './ai-provider.service';
import { GlobalAiKeyModule } from '../admin/global-ai-key.module';

@Module({
  imports: [GlobalAiKeyModule],
  controllers: [AiProviderController],
  providers: [AiProviderService],
  exports: [AiProviderService],
})
export class AiProviderModule {}

