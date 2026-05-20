import { Controller, Post, Get, Body, Param, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Controller('knowledge')
@UseGuards(AuthGuard('jwt'))
export class KnowledgeController {
  constructor(
    private readonly knowledgeService: KnowledgeService,
    private prisma: PrismaService,
  ) {}

  @Post(':agentId')
  async createBase(@Req() req: Request, @Param('agentId') agentId: string, @Body() data: { name: string }) {
    return this.prisma.knowledgeBase.create({
      data: {
        name: data.name,
        agentId,
        tenantId: (req.user as any).id,
      },
    });
  }

  @Get(':agentId')
  async getBases(@Param('agentId') agentId: string) {
    return this.prisma.knowledgeBase.findMany({
      where: { agentId },
      include: { _count: { select: { chunks: true } } },
    });
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: any,
  ) {
    // Basic text file processing
    const content = file.buffer.toString('utf-8');
    await this.knowledgeService.ingestText(id, content, { filename: file.originalname });
    return { success: true };
  }
}
