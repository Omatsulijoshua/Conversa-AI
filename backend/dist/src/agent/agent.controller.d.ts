import type { Request } from 'express';
import { AgentService } from './agent.service';
export declare class AgentController {
    private readonly agentService;
    constructor(agentService: AgentService);
    create(req: Request, createAgentDto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        tone: string | null;
        industry: string | null;
        instructions: string | null;
        voiceId: string | null;
    }>;
    findAll(req: Request): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        tone: string | null;
        industry: string | null;
        instructions: string | null;
        voiceId: string | null;
    }[]>;
    findOne(req: Request, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        tone: string | null;
        industry: string | null;
        instructions: string | null;
        voiceId: string | null;
    } | null>;
    update(req: Request, id: string, updateAgentDto: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    remove(req: Request, id: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
