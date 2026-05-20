import { Controller, Get, Post, Body, Delete, Param, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { WebhookService } from './webhook.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('webhooks')
@UseGuards(AuthGuard('jwt'))
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async create(@Req() req: Request, @Body() data: { url: string; events: string[] }) {
    return this.webhookService.register((req.user as any).id, data.url, data.events);
  }

  @Get()
  async findAll(@Req() req: Request) {
    return this.webhookService.findByTenant((req.user as any).id);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    return this.webhookService.remove((req.user as any).id, id);
  }
}
