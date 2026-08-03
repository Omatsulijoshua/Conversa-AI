import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { AiService } from '../ai/ai.service';
import { KnowledgeService } from '../knowledge/knowledge.service';

@Injectable()
export class ConversationService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
    private knowledge: KnowledgeService,
  ) {}

  async start(tenantId: string, agentId: string, customSessionId?: string) {
    const agent = await this.prisma.agent.findFirst({
      where: { id: agentId, tenantId },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const sessionId = customSessionId || uuidv4();
    return this.prisma.conversation.create({
      data: {
        sessionId,
        agentId,
        tenantId,
        messages: [],
      },
    });
  }

  async message(tenantId: string, sessionId: string, message: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { sessionId, tenantId },
      include: { agent: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const messages = (conversation.messages as any[]) || [];
    messages.push({ role: 'user', content: message, timestamp: new Date() });

    const recent = messages
      .slice(-20)
      .filter(m => m?.role === 'user' || m?.role === 'assistant')
      .map(m => ({ role: m.role, content: String(m.content ?? '') }));

    const topChunks = await this.knowledge.query(conversation.agentId, message, 3);
    const knowledgeContext = topChunks.map((c: { content: string }) => `- ${c.content}`).join('\n');

    const agentSettings = (conversation.agent.settings as any) || {};
    const modelName = agentSettings.modelName || agentSettings.model || null;
    const temperature = agentSettings.temperature !== undefined && agentSettings.temperature !== null ? Number(agentSettings.temperature) : null;

    const aiResponse = await this.ai.reply({
      tenantId,
      agent: {
        name: conversation.agent.name,
        tone: conversation.agent.tone,
        industry: conversation.agent.industry,
        instructions: conversation.agent.instructions,
      },
      messages: recent,
      knowledgeContext: knowledgeContext.length ? knowledgeContext : null,
      modelName,
      temperature,
    });
    
    messages.push({ role: 'assistant', content: aiResponse, timestamp: new Date() });

    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { messages },
    });

    // Track usage
    await this.prisma.usage.create({
      data: {
        tenantId,
        metric: 'messages',
        quantity: 1,
      },
    });

    return { response: aiResponse };
  }

  async history(tenantId: string, sessionId: string) {
    return this.prisma.conversation.findFirst({
      where: { sessionId, tenantId },
    });
  }
}
