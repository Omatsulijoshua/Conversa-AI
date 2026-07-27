import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: any): Promise<{
        access_token: string;
        tenant: {
            id: string;
            name: string;
            email: string;
        };
        apiKey: string;
    }>;
    login(data: any): Promise<{
        access_token: string;
        tenant: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    googleLogin(req: any): Promise<{
        access_token: string;
        tenant: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    validateTenant(payload: any): Promise<{
        id: string;
        email: string;
        name: string;
        password: string | null;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
        usageLimit: number;
    } | null>;
}
