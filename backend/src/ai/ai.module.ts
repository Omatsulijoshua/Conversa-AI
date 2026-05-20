import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiProviderModule } from '../ai-provider/ai-provider.module';

@Module({
  imports: [AiProviderModule],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
