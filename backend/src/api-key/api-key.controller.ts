import { Controller, Get, Post, Body, Delete, Param, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiKeyService } from './api-key.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api-keys')
@UseGuards(AuthGuard('jwt'))
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  async create(@Req() req: Request, @Body() data: { name: string }) {
    return this.apiKeyService.create((req.user as any).id, data.name);
  }

  @Get()
  async findAll(@Req() req: Request) {
    return this.apiKeyService.findAll((req.user as any).id);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    return this.apiKeyService.remove((req.user as any).id, id);
  }
}
