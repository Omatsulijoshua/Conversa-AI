import { Controller, Get, Param, Query, Res, UseGuards, NotFoundException } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { TenantAuthGuard } from '../auth/tenant-auth.guard';
import { Tenant } from '../common/decorators/tenant.decorator';
import { PrismaService } from '../prisma/prisma.service';
import type { Response } from 'express';
import { KnowledgeService } from '../knowledge/knowledge.service';

@Controller('training')
@UseGuards(TenantAuthGuard)
export class TrainingController {
  constructor(
    private prisma: PrismaService,
    private knowledge: KnowledgeService,
  ) {}

  @Get('status/:agentId')
  async status(@Tenant() tenant: any, @Param('agentId') agentId: string) {
    const agent = await this.prisma.agent.findFirst({
      where: { id: agentId, tenantId: tenant.id },
      include: {
        knowledgeBases: { include: { _count: { select: { chunks: true } } } },
        _count: { select: { conversations: true } },
      },
    });
    if (!agent) throw new NotFoundException('Agent not found.');

    const knowledgeChunks = agent.knowledgeBases.reduce((total, base) => total + base._count.chunks, 0);
    const checks = [
      { id: 'rules', label: 'Business rules and guardrails', complete: Boolean(agent.instructions?.trim() && agent.instructions.length >= 120), href: '/agents' },
      { id: 'knowledge', label: 'Approved company knowledge', complete: knowledgeChunks > 0, href: '/agents' },
      { id: 'voice', label: 'Production voice selected', complete: Boolean(agent.voiceId?.trim()), href: '/agents' },
      { id: 'test', label: 'Test conversation completed', complete: agent._count.conversations > 0, href: '/playground' },
    ];
    const completed = checks.filter(check => check.complete).length;
    return {
      agent: { id: agent.id, name: agent.name },
      checks,
      completed,
      total: checks.length,
      score: Math.round((completed / checks.length) * 100),
      readyForProduction: completed === checks.length,
      knowledge: { collections: agent.knowledgeBases.length, chunks: knowledgeChunks },
    };
  }

  @Post('bootstrap')
  async bootstrap(@Tenant() tenant: any, @Body() body?: { businessName?: string }) {
    const businessName = body?.businessName?.trim() || 'Conversa Demo';
    const agent = await this.prisma.agent.upsert({
      where: {
        id: `${tenant.id}_demo_support`,
      },
      update: {
        name: `${businessName} Support`,
        tone: 'warm, calm, natural, and concise',
        industry: 'customer support',
        instructions:
          'Answer like a capable human customer support representative. Confirm the customer need, give one clear next step, and escalate billing, account access, or safety issues when needed.',
      },
      create: {
        id: `${tenant.id}_demo_support`,
        name: `${businessName} Support`,
        tone: 'warm, calm, natural, and concise',
        industry: 'customer support',
        instructions:
          'Answer like a capable human customer support representative. Confirm the customer need, give one clear next step, and escalate billing, account access, or safety issues when needed.',
        voiceId: 'alloy',
        tenantId: tenant.id,
      },
    });

    const knowledgeBase = await this.prisma.knowledgeBase.upsert({
      where: { id: `${agent.id}_training_pack` },
      update: { name: 'Customer Support Training Pack' },
      create: {
        id: `${agent.id}_training_pack`,
        name: 'Customer Support Training Pack',
        description: 'Starter support policies and call handling examples.',
        agentId: agent.id,
        tenantId: tenant.id,
      },
    });

    const existingChunks = await this.prisma.documentChunk.count({ where: { knowledgeBaseId: knowledgeBase.id } });
    if (existingChunks === 0) {
      await this.knowledge.ingestText(
        knowledgeBase.id,
        [
          'Greeting: Start every call with a short warm greeting, then ask how you can help.',
          'Refunds: If a customer asks for a refund, confirm their email, order number, and reason. Explain that eligible refunds are reviewed within 2 business days.',
          'Account access: For login trouble, ask the customer to confirm their email, then guide them to reset their password. Never ask for a full password.',
          'Escalation: Escalate to a human when the customer is angry, reports fraud, asks for legal advice, or needs account ownership changes.',
          'Closing: End by summarizing the next step and asking if there is anything else you can help with.',
        ].join('\n\n'),
        { source: 'bootstrap-training-pack' },
      );
    }

    return {
      agent,
      knowledgeBase,
      ready: true,
      testPrompt: 'Hi, I need help with a refund for my order.',
    };
  }

  @Get('export/conversations')
  async exportConversations(@Tenant() tenant: any, @Res() res: Response) {
    const conversations = await this.prisma.conversation.findMany({
      where: { tenantId: tenant.id },
      include: { agent: true },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    const lines = conversations.map(c =>
      JSON.stringify({
        type: 'conversation',
        id: c.id,
        sessionId: c.sessionId,
        agent: { id: c.agentId, name: c.agent.name },
        createdAt: c.createdAt,
        messages: c.messages ?? [],
      }),
    );

    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.send(lines.join('\n'));
  }

  @Get('export/calls')
  async exportCalls(@Tenant() tenant: any, @Res() res: Response, @Query('includeTranscript') includeTranscript?: string) {
    const calls = await this.prisma.call.findMany({
      where: { tenantId: tenant.id },
      include: { agent: true },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    const withTranscript = includeTranscript === '1' || includeTranscript === 'true';
    const lines = calls.map(c =>
      JSON.stringify({
        type: 'call',
        id: c.id,
        sid: c.sid,
        from: c.from,
        to: c.to,
        status: c.status,
        duration: c.duration,
        agent: { id: c.agentId, name: c.agent.name },
        createdAt: c.createdAt,
        transcript: withTranscript ? (c as any).transcript ?? null : undefined,
        summary: (c as any).summary ?? null,
        outcome: (c as any).outcome ?? null,
      }),
    );

    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.send(lines.join('\n'));
  }
}
