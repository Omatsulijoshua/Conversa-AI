import { KnowledgeService } from './knowledge.service';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
export declare class KnowledgeController {
    private readonly knowledgeService;
    private prisma;
    constructor(knowledgeService: KnowledgeService, prisma: PrismaService);
    createBase(req: Request, agentId: string, data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        agentId: string;
    }>;
    getBases(agentId: string): Promise<({
        _count: {
            chunks: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        agentId: string;
    })[]>;
    uploadFile(id: string, file: any): Promise<{
        success: boolean;
    }>;
}
