import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { TwilioMessagingController } from './twilio-messaging.controller';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [ConversationModule],
  controllers: [WebhookController, TwilioMessagingController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
