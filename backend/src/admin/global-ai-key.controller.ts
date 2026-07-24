import { Controller, Get, Post, Delete, Patch, Body, Param, Headers, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalAiKeyService } from './global-ai-key.service';

@Controller('admin/global-keys')
export class GlobalAiKeyController {
  constructor(
    private readonly service: GlobalAiKeyService,
    private readonly config: ConfigService,
  ) {}

  private verifyToken(adminToken?: string) {
    const expectedToken = this.config.get<string>('ADMIN_DASHBOARD_TOKEN');
    if (expectedToken && adminToken !== expectedToken) {
      throw new UnauthorizedException('Invalid admin dashboard token');
    }
  }

  @Get()
  async list(@Headers('x-admin-token') adminToken?: string) {
    this.verifyToken(adminToken);
    return this.service.list();
  }

  @Post()
  async create(
    @Body() body: {
      provider: string;
      apiKey: string;
      label: string;
      modelName?: string;
      baseUrl?: string;
      weight?: number;
      isActive?: boolean;
    },
    @Headers('x-admin-token') adminToken?: string,
  ) {
    this.verifyToken(adminToken);
    return this.service.create(body);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('x-admin-token') adminToken?: string,
  ) {
    this.verifyToken(adminToken);
    return this.service.remove(id);
  }

  @Patch(':id/toggle')
  async toggleActive(
    @Param('id') id: string,
    @Headers('x-admin-token') adminToken?: string,
  ) {
    this.verifyToken(adminToken);
    return this.service.toggleActive(id);
  }

  @Post('strategy')
  async updateStrategy(
    @Body() body: { strategy: string },
    @Headers('x-admin-token') adminToken?: string,
  ) {
    this.verifyToken(adminToken);
    return this.service.updateStrategy(body.strategy);
  }
}
