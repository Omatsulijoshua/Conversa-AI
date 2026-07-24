import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

type CreateGlobalKeyInput = {
  provider: string;
  apiKey: string;
  label: string;
  modelName?: string;
  baseUrl?: string;
  weight?: number;
  isActive?: boolean;
};

@Injectable()
export class GlobalAiKeyService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async list() {
    const [keys, config] = await Promise.all([
      this.prisma.globalAiKey.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      this.getOrCreateRoutingConfig(),
    ]);

    return {
      strategy: config.strategy,
      keys: keys.map(k => this.publicFormat(k)),
    };
  }

  async create(input: CreateGlobalKeyInput) {
    if (!input.apiKey?.trim()) {
      throw new BadRequestException('API key is required');
    }

    const key = await this.prisma.globalAiKey.create({
      data: {
        provider: input.provider.toLowerCase().trim(),
        label: input.label.trim(),
        encryptedApiKey: this.encrypt(input.apiKey.trim()),
        keyPreview: this.preview(input.apiKey.trim()),
        modelName: input.modelName?.trim() || null,
        baseUrl: input.baseUrl?.trim() || null,
        weight: input.weight ?? 1,
        isActive: input.isActive ?? true,
      },
    });

    return this.publicFormat(key);
  }

  async remove(id: string) {
    const existing = await this.prisma.globalAiKey.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Global key not found');

    await this.prisma.globalAiKey.delete({ where: { id } });
    return { deleted: true };
  }

  async toggleActive(id: string) {
    const existing = await this.prisma.globalAiKey.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Global key not found');

    const updated = await this.prisma.globalAiKey.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    return this.publicFormat(updated);
  }

  async updateStrategy(strategy: string) {
    const normalized = strategy.toLowerCase().trim();
    if (!['weighted', 'round-robin', 'failover'].includes(normalized)) {
      throw new BadRequestException('Invalid routing strategy. Choose weighted, round-robin, or failover.');
    }

    const config = await this.prisma.globalRoutingConfig.upsert({
      where: { id: 'global_routing_config' },
      update: { strategy: normalized },
      create: { id: 'global_routing_config', strategy: normalized },
    });

    return config;
  }

  async selectRoutedKey(provider?: string) {
    const activeKeys = await this.prisma.globalAiKey.findMany({
      where: {
        isActive: true,
        ...(provider ? { provider: provider.toLowerCase().trim() } : {}),
      },
    });

    if (activeKeys.length === 0) {
      return null;
    }

    const config = await this.getOrCreateRoutingConfig();
    let selected: any = null;

    if (config.strategy === 'round-robin') {
      // Sort: null lastUsed first, then oldest lastUsed
      const sorted = [...activeKeys].sort((a, b) => {
        if (!a.lastUsed) return -1;
        if (!b.lastUsed) return 1;
        return a.lastUsed.getTime() - b.lastUsed.getTime();
      });
      selected = sorted[0];
    } else if (config.strategy === 'failover') {
      // Sort: oldest createdAt first (Failover priority)
      const sorted = [...activeKeys].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      selected = sorted[0];
    } else {
      // default: weighted load balancing
      const totalWeight = activeKeys.reduce((sum, k) => sum + (k.weight || 1), 0);
      const randomValue = Math.random() * totalWeight;
      let runningSum = 0;

      for (const key of activeKeys) {
        runningSum += key.weight || 1;
        if (randomValue <= runningSum) {
          selected = key;
          break;
        }
      }
      if (!selected) selected = activeKeys[0];
    }

    if (selected) {
      // Mark key as used
      await this.prisma.globalAiKey.update({
        where: { id: selected.id },
        data: { lastUsed: new Date() },
      });

      return {
        ...this.publicFormat(selected),
        apiKey: this.decrypt(selected.encryptedApiKey),
      };
    }

    return null;
  }

  private async getOrCreateRoutingConfig() {
    let config = await this.prisma.globalRoutingConfig.findUnique({
      where: { id: 'global_routing_config' },
    });
    if (!config) {
      config = await this.prisma.globalRoutingConfig.create({
        data: { id: 'global_routing_config', strategy: 'weighted' },
      });
    }
    return config;
  }

  private publicFormat(row: any) {
    return {
      id: row.id,
      provider: row.provider,
      label: row.label,
      keyPreview: row.keyPreview,
      modelName: row.modelName,
      baseUrl: row.baseUrl,
      weight: row.weight,
      isActive: row.isActive,
      lastUsed: row.lastUsed,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
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
