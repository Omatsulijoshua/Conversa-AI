import { Controller, Post, Body, Query, Header, HttpCode } from '@nestjs/common';
import { ConversationService } from '../conversation/conversation.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('voice/telephony')
export class VoiceTelephonyController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('inbound')
  @HttpCode(200)
  @Header('Content-Type', 'text/xml')
  async inbound(
    @Query('agentId') agentId?: string,
    @Query('tenantId') tenantId?: string,
  ) {
    let activeAgentId = agentId;
    let activeTenantId = tenantId;

    if (!activeAgentId || !activeTenantId) {
      const agent = await this.prisma.agent.findFirst({
        include: { tenant: true },
      });
      if (!agent) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Sorry, no agents are configured on this platform yet. Please check back later.</Say>
</Response>`;
      }
      activeAgentId = agent.id;
      activeTenantId = agent.tenantId;
    }

    // Start a conversation session
    const conversation = await this.conversationService.start(activeTenantId, activeAgentId);

    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="/api/v1/voice/telephony/respond?agentId=${activeAgentId}&amp;tenantId=${activeTenantId}&amp;sessionId=${conversation.sessionId}" method="POST" speechTimeout="auto" speechModel="phone_call">
    <Say voice="Polly.Joanna-Neural">Hello! Thank you for calling. How can I help you today?</Say>
  </Gather>
  <Say voice="Polly.Joanna-Neural">We did not receive any input. Goodbye.</Say>
</Response>`;
  }

  @Post('respond')
  @HttpCode(200)
  @Header('Content-Type', 'text/xml')
  async respond(
    @Body('SpeechResult') speechResult?: string,
    @Query('agentId') agentId?: string,
    @Query('tenantId') tenantId?: string,
    @Query('sessionId') sessionId?: string,
  ) {
    if (!speechResult || !agentId || !tenantId || !sessionId) {
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna-Neural">I am sorry, I did not catch that. Goodbye.</Say>
</Response>`;
    }

    try {
      // Get AI Agent's text response using our business logic and policies
      const reply = await this.conversationService.message(tenantId, sessionId, speechResult);

      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="/api/v1/voice/telephony/respond?agentId=${agentId}&amp;tenantId=${tenantId}&amp;sessionId=${sessionId}" method="POST" speechTimeout="auto" speechModel="phone_call">
    <Say voice="Polly.Joanna-Neural">${reply.response}</Say>
  </Gather>
  <Say voice="Polly.Joanna-Neural">Thank you for calling. Goodbye.</Say>
</Response>`;
    } catch (error: any) {
      console.error('Telephony respond error:', error);
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna-Neural">I encountered an error processing your request. Please try again later.</Say>
</Response>`;
    }
  }
}
