import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, name: string) {
    return this.prisma.apiKey.create({
      data: {
        tenantId,
        name,
        key: `cv_${uuidv4().replace(/-/g, '')}`,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.apiKey.findMany({
      where: { tenantId },
    });
  }

  async remove(tenantId: string, id: string) {
    return this.prisma.apiKey.deleteMany({
      where: { id, tenantId },
    });
  }
}
