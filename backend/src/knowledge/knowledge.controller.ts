import { BadRequestException, Controller, Delete, Post, Get, Body, Param, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';

@Controller('knowledge')
@UseGuards(AuthGuard('jwt'))
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post(':agentId')
  async createBase(@Req() req: Request, @Param('agentId') agentId: string, @Body() data: { name: string }) {
    if (!data.name?.trim()) throw new BadRequestException('Knowledge base name is required.');
    return this.knowledgeService.createBase((req.user as any).id, agentId, data.name.trim());
  }

  @Get(':agentId')
  async getBases(@Req() req: Request, @Param('agentId') agentId: string) {
    return this.knowledgeService.getBases((req.user as any).id, agentId);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFile() file: any,
  ) {
    if (!file?.buffer) throw new BadRequestException('Please choose a file.');
    return this.knowledgeService.ingestFile((req.user as any).id, id, file);
  }

  @Delete(':id')
  async deleteBase(@Req() req: Request, @Param('id') id: string) {
    return this.knowledgeService.deleteBase((req.user as any).id, id);
  }
}
