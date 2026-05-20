import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AgentModule } from './agent/agent.module';
import { ConversationModule } from './conversation/conversation.module';
import { SpeechModule } from './speech/speech.module';
import { VoiceModule } from './voice/voice.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { WebhookModule } from './webhook/webhook.module';
import { BillingModule } from './billing/billing.module';
import { ApiKeyModule } from './api-key/api-key.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AiModule } from './ai/ai.module';
import { TrainingModule } from './training/training.module';
import { AdminDashboardModule } from './admin/admin-dashboard.module';
import { AiProviderModule } from './ai-provider/ai-provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    PrismaModule,
    AuthModule,
    AgentModule,
    ConversationModule,
    SpeechModule,
    VoiceModule,
    AnalyticsModule,
    WebhookModule,
    BillingModule,
    ApiKeyModule,
    KnowledgeModule,
    AiModule,
    TrainingModule,
    AdminDashboardModule,
    AiProviderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
