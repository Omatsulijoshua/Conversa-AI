import { Controller, Post, Body, Query, Header, HttpCode } from '@nestjs/common';
import { ConversationService } from '../conversation/conversation.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('webhooks/twilio')
export class TwilioMessagingController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('messaging')
  @HttpCode(200)
  @Header('Content-Type', 'text/xml')
  async handleIncomingMessage(
    @Body('Body') body?: string,
    @Body('From') from?: string,
    @Query('agentId') agentId?: string,
    @Query('tenantId') tenantId?: string,
  ) {
    if (!body || !from) {
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response />`;
    }

    let activeAgentId = agentId;
    let activeTenantId = tenantId;

    // Resolve agent and tenant if not passed
    if (!activeAgentId || !activeTenantId) {
      const agent = await this.prisma.agent.findFirst({
        include: { tenant: true },
      });
      if (!agent) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Platform error: No AI agents are active.</Message>
</Response>`;
      }
      activeAgentId = agent.id;
      activeTenantId = agent.tenantId;
    }

    try {
      // Check if a conversation session with the sender phone number already exists
      const existing = await this.prisma.conversation.findFirst({
        where: { sessionId: from, tenantId: activeTenantId },
      });

      if (!existing) {
        // Create new conversation with sender phone number as sessionId
        await this.conversationService.start(activeTenantId, activeAgentId, from);
      }

      // Query AI Agent response
      const reply = await this.conversationService.message(activeTenantId, from, body);

      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${reply.response}</Message>
</Response>`;
    } catch (error) {
      console.error('Twilio messaging error:', error);
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Sorry, I encountered an issue processing your request. Please try again later.</Message>
</Response>`;
    }
  }
}
