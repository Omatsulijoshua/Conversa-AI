import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import {
  DEFAULT_CHAT_MODELS,
  OPENAI_COMPATIBLE_BASE_URLS,
  SUPPORTED_AI_PROVIDERS,
  SupportedAiProvider,
} from './ai-provider.constants';

type CreateProviderKeyInput = {
  provider: string;
  apiKey: string;
  label?: string;
  modelName?: string;
  baseUrl?: string;
  makeActive?: boolean;
};

@Injectable()
export class AiProviderService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async list(tenantId: string) {
    const rows = await this.prisma.aiProviderKey.findMany({
      where: { tenantId },
      orderBy: [{ isActive: 'desc' }, { createdAt: 'asc' }],
    });

    return {
      limit: 7,
      supportedProviders: SUPPORTED_AI_PROVIDERS,
      providers: rows.map(row => this.publicProvider(row)),
    };
  }

  async createOrUpdate(tenantId: string, input: CreateProviderKeyInput) {
    const provider = this.normalizeProvider(input.provider);
    if (!input.apiKey?.trim()) {
      throw new BadRequestException('API key is required');
    }

    const existingCount = await this.prisma.aiProviderKey.count({ where: { tenantId } });
    const existing = await this.prisma.aiProviderKey.findUnique({
      where: { tenantId_provider: { tenantId, provider } },
    });

    if (!existing && existingCount >= 7) {
      throw new BadRequestException('You can store up to 7 AI provider keys');
    }

    if (input.makeActive ?? existingCount === 0) {
      await this.prisma.aiProviderKey.updateMany({
        where: { tenantId },
        data: { isActive: false },
      });
    }

    const row = await this.prisma.aiProviderKey.upsert({
      where: { tenantId_provider: { tenantId, provider } },
      update: {
        label: input.label?.trim() || this.defaultLabel(provider),
        encryptedApiKey: this.encrypt(input.apiKey.trim()),
        keyPreview: this.preview(input.apiKey.trim()),
        modelName: input.modelName?.trim() || DEFAULT_CHAT_MODELS[provider],
        baseUrl: input.baseUrl?.trim() || OPENAI_COMPATIBLE_BASE_URLS[provider] || null,
        isActive: input.makeActive ?? existingCount === 0,
      },
      create: {
        provider,
        label: input.label?.trim() || this.defaultLabel(provider),
        encryptedApiKey: this.encrypt(input.apiKey.trim()),
        keyPreview: this.preview(input.apiKey.trim()),
        modelName: input.modelName?.trim() || DEFAULT_CHAT_MODELS[provider],
        baseUrl: input.baseUrl?.trim() || OPENAI_COMPATIBLE_BASE_URLS[provider] || null,
        isActive: input.makeActive ?? existingCount === 0,
        tenantId,
      },
    });

    return this.publicProvider(row);
  }

  async setActive(tenantId: string, id: string) {
    const provider = await this.prisma.aiProviderKey.findFirst({ where: { id, tenantId } });
    if (!provider) throw new NotFoundException('AI provider key not found');

    await this.prisma.aiProviderKey.updateMany({ where: { tenantId }, data: { isActive: false } });
    const row = await this.prisma.aiProviderKey.update({ where: { id }, data: { isActive: true } });
    return this.publicProvider(row);
  }

  async remove(tenantId: string, id: string) {
    const provider = await this.prisma.aiProviderKey.findFirst({ where: { id, tenantId } });
    if (!provider) throw new NotFoundException('AI provider key not found');

    await this.prisma.aiProviderKey.delete({ where: { id } });

    if (provider.isActive) {
      const next = await this.prisma.aiProviderKey.findFirst({
        where: { tenantId },
        orderBy: { createdAt: 'asc' },
      });
      if (next) {
        await this.prisma.aiProviderKey.update({ where: { id: next.id }, data: { isActive: true } });
      }
    }

    return { deleted: true };
  }

  async getActiveKey(tenantId: string) {
    const row = await this.prisma.aiProviderKey.findFirst({
      where: { tenantId, isActive: true },
    });

    if (row) {
      return {
        ...this.publicProvider(row),
        apiKey: this.decrypt(row.encryptedApiKey),
      };
    }

    const envKey = this.config.get<string>('OPENAI_API_KEY');
    if (!envKey) return null;

    return {
      id: 'env-openai',
      provider: 'openai',
      label: 'OpenAI Environment Key',
      keyPreview: this.preview(envKey),
      modelName: this.config.get<string>('OPENAI_CHAT_MODEL') || DEFAULT_CHAT_MODELS.openai,
      baseUrl: OPENAI_COMPATIBLE_BASE_URLS.openai || null,
      isActive: true,
      lastUsed: null,
      createdAt: null,
      updatedAt: null,
      apiKey: envKey,
    };
  }

  async markUsed(id: string) {
    if (id === 'env-openai') return;
    await this.prisma.aiProviderKey.update({
      where: { id },
      data: { lastUsed: new Date() },
    });
  }

  private publicProvider(row: {
    id: string;
    provider: string;
    label: string;
    keyPreview: string;
    modelName: string | null;
    baseUrl: string | null;
    isActive: boolean;
    lastUsed: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: row.id,
      provider: row.provider,
      label: row.label,
      keyPreview: row.keyPreview,
      modelName: row.modelName,
      baseUrl: row.baseUrl,
      isActive: row.isActive,
      lastUsed: row.lastUsed,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private normalizeProvider(provider: string): SupportedAiProvider {
    const normalized = provider?.toLowerCase().trim() as SupportedAiProvider;
    if (!SUPPORTED_AI_PROVIDERS.includes(normalized)) {
      throw new BadRequestException(`Supported providers: ${SUPPORTED_AI_PROVIDERS.join(', ')}`);
    }
    return normalized;
  }

  private defaultLabel(provider: SupportedAiProvider) {
    return `${provider[0].toUpperCase()}${provider.slice(1)} Key`;
  }

  private preview(apiKey: string) {
    if (apiKey.length <= 8) return '••••••••';
    return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
  }

  private encrypt(value: string) {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.secret(), iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`;
  }

  private decrypt(value: string) {
    const [ivRaw, tagRaw, encryptedRaw] = value.split('.');
    const decipher = createDecipheriv('aes-256-gcm', this.secret(), Buffer.from(ivRaw, 'base64'));
    decipher.setAuthTag(Buffer.from(tagRaw, 'base64'));
    return Buffer.concat([
      decipher.update(Buffer.from(encryptedRaw, 'base64')),
      decipher.final(),
    ]).toString('utf8');
  }

  private secret() {
    return createHash('sha256')
      .update(this.config.get<string>('AI_KEY_ENCRYPTION_SECRET') || this.config.get<string>('JWT_SECRET') || 'dev_secret_change_me')
      .digest();
  }
}
