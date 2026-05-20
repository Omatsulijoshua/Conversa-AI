import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { TenantAuthGuard } from '../auth/tenant-auth.guard';
import { Tenant } from '../common/decorators/tenant.decorator';
import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';

@ApiTags('Conversations')
@ApiSecurity('x-api-key')
@Controller('conversation')
@UseGuards(TenantAuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('start')
  start(@Tenant() tenant: any, @Body() body: { agentId: string }) {
    return this.conversationService.start(tenant.id, body.agentId);
  }

  @Post('message')
  message(@Tenant() tenant: any, @Body() body: { sessionId: string; message: string }) {
    return this.conversationService.message(tenant.id, body.sessionId, body.message);
  }

  @Get('history/:sessionId')
  history(@Tenant() tenant: any, @Param('sessionId') sessionId: string) {
    return this.conversationService.history(tenant.id, sessionId);
  }
}
