import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const existing = await this.prisma.tenant.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const tenant = await this.prisma.tenant.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    // Generate initial API Key
    const apiKey = await this.prisma.apiKey.create({
      data: {
        key: `cv_${Math.random().toString(36).substring(2, 15)}`,
        name: 'Default Key',
        tenantId: tenant.id,
      },
    });

    return {
      access_token: this.jwtService.sign({ sub: tenant.id, email: tenant.email }),
      tenant: { id: tenant.id, name: tenant.name, email: tenant.email },
      apiKey: apiKey.key,
    };
  }

  async login(data: any) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { email: data.email },
    });

    if (!tenant || !tenant.password || !(await bcrypt.compare(data.password, tenant.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: tenant.id, email: tenant.email };
    return {
      access_token: this.jwtService.sign(payload),
      tenant: { id: tenant.id, name: tenant.name, email: tenant.email },
    };
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }

    let tenant = await this.prisma.tenant.findUnique({
      where: { email: req.user.email },
    });

    if (!tenant) {
      tenant = await this.prisma.tenant.create({
        data: {
          name: `${req.user.firstName} ${req.user.lastName}`,
          email: req.user.email,
          password: null, // No password for OAuth users
        },
      });

      // Generate initial API Key for new OAuth user
      await this.prisma.apiKey.create({
        data: {
          key: `cv_${Math.random().toString(36).substring(2, 15)}`,
          name: 'Default Key',
          tenantId: tenant.id,
        },
      });
    }

    const payload = { sub: tenant.id, email: tenant.email };
    return {
      access_token: this.jwtService.sign(payload),
      tenant: { id: tenant.id, name: tenant.name, email: tenant.email },
    };
  }

  async validateTenant(payload: any) {
    return this.prisma.tenant.findUnique({ where: { id: payload.sub } });
  }
}
