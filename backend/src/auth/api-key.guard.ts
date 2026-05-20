import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API Key is missing');
    }

    const keyRecord = await this.prisma.apiKey.findUnique({
      where: { key: apiKey as string },
      include: { tenant: true },
    });

    if (!keyRecord) {
      throw new UnauthorizedException('Invalid API Key');
    }

    // Attach tenant info to the request
    request['tenant'] = keyRecord.tenant;
    
    // Update last used timestamp asynchronously
    this.prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsed: new Date() }
    }).catch(err => console.error('Failed to update API Key lastUsed:', err));

    return true;
  }
}
