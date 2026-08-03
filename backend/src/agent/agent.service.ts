import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AgentService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    const tone = data.tone || 'Warm, patient, clear, and natural.';
    return this.prisma.agent.create({
      data: {
        name: data.name,
        tone,
        industry: data.industry || data.type,
        instructions: data.instructions || this.defaultBusinessRules(data.type || data.industry || 'Support', tone),
        voiceId: data.voiceId || data.voice,
        settings: data.settings || {},
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.agent.findMany({
      where: { tenantId },
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.agent.findFirst({
      where: { id, tenantId },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    return this.prisma.agent.updateMany({
      where: { id, tenantId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.tone !== undefined ? { tone: data.tone } : {}),
        ...(data.industry !== undefined || data.type !== undefined ? { industry: data.industry || data.type } : {}),
        ...(data.instructions !== undefined ? { instructions: data.instructions } : {}),
        ...(data.voiceId !== undefined || data.voice !== undefined ? { voiceId: data.voiceId || data.voice } : {}),
        ...(data.settings !== undefined ? { settings: data.settings } : {}),
      },
    });
  }

  async remove(tenantId: string, id: string) {
    return this.prisma.agent.deleteMany({
      where: { id, tenantId },
    });
  }

  private defaultBusinessRules(goal: string, tone: string) {
    return [
      'Business Rules for Customer Calls',
      'Greeting: Hi, thanks for calling. How can I help you today?',
      `Tone: ${tone}`,
      `Main Goal: Help with ${goal} questions, explain next steps, and escalate when needed.`,
      'Business Hours: Monday to Friday, 9 AM to 5 PM.',
      'Refund Policy: Ask for the order number, email, and reason. Eligible refunds are reviewed within 2 business days.',
      'Escalation Rules: Escalate angry customers, billing disputes, fraud reports, legal questions, and account ownership changes.',
      'Information to Collect: Name, phone number, email, order number, and a short description of the issue.',
      'Never Say or Ask: Do not ask for passwords, full card numbers, SSNs, or legal/medical advice.',
      'Call Closing: Summarize the next step and ask if there is anything else you can help with.',
    ].join('\n\n');
  }
}
