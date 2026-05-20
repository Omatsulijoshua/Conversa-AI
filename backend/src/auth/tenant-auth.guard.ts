import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantAuthGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (apiKey) {
      const keyRecord = await this.prisma.apiKey.findUnique({
        where: { key: apiKey as string },
        include: { tenant: true },
      });

      if (!keyRecord) throw new UnauthorizedException('Invalid API Key');

      request.tenant = keyRecord.tenant;
      request.user = keyRecord.tenant;
      this.prisma.apiKey
        .update({ where: { id: keyRecord.id }, data: { lastUsed: new Date() } })
        .catch(err => console.error('Failed to update API Key lastUsed:', err));
      return true;
    }

    const authHeader = request.headers.authorization as string | undefined;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) throw new UnauthorizedException('API key or bearer token is required');

    const payload = await this.jwt.verifyAsync(token, {
      secret: this.config.get<string>('JWT_SECRET') || 'dev_secret_change_me',
    });
    const tenant = await this.prisma.tenant.findUnique({ where: { id: payload.sub } });
    if (!tenant) throw new UnauthorizedException('Invalid bearer token');

    request.tenant = tenant;
    request.user = tenant;
    return true;
  }
}

