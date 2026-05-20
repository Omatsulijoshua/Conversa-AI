import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AiProviderService } from './ai-provider.service';

@Controller('ai-providers')
@UseGuards(AuthGuard('jwt'))
export class AiProviderController {
  constructor(private readonly aiProviderService: AiProviderService) {}

  @Get()
  list(@Req() req: Request) {
    return this.aiProviderService.list((req.user as any).id);
  }

  @Post()
  createOrUpdate(@Req() req: Request, @Body() body: any) {
    return this.aiProviderService.createOrUpdate((req.user as any).id, body);
  }

  @Patch(':id/active')
  setActive(@Req() req: Request, @Param('id') id: string) {
    return this.aiProviderService.setActive((req.user as any).id, id);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.aiProviderService.remove((req.user as any).id, id);
  }
}

