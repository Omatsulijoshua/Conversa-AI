import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AgentService } from './agent.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';

@ApiTags('Agents')
@ApiSecurity('x-api-key')
@Controller('agent')
@UseGuards(AuthGuard('jwt'))
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new AI agent' })
  create(@Req() req: Request, @Body() createAgentDto: any) {
    return this.agentService.create((req.user as any).id, createAgentDto);
  }

  @Get('config')
  @ApiOperation({ summary: 'Get all agents for the tenant' })
  findAll(@Req() req: Request) {
    return this.agentService.findAll((req.user as any).id);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.agentService.findOne((req.user as any).id, id);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() updateAgentDto: any) {
    return this.agentService.update((req.user as any).id, id, updateAgentDto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.agentService.remove((req.user as any).id, id);
  }
}
