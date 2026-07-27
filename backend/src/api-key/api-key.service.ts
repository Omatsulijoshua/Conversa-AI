import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, name: string) {
    const created = await this.prisma.apiKey.create({
      data: {
        tenantId,
        name,
        key: `cv_${uuidv4().replace(/-/g, '')}`,
      },
    });
    return { ...created, keyPreview: this.preview(created.key) };
  }

  async findAll(tenantId: string) {
    const keys = await this.prisma.apiKey.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
    return keys.map(({ key, ...item }) => ({ ...item, keyPreview: this.preview(key) }));
  }

  async remove(tenantId: string, id: string) {
    return this.prisma.apiKey.deleteMany({
      where: { id, tenantId },
    });
  }

  private preview(key: string) {
    return `${key.slice(0, 7)}••••••••${key.slice(-4)}`;
  }
}
