import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
        access_token: string;
        tenant: {
            id: string;
            name: string;
            email: string;
        };
        apiKey: string;
    }>;
    login(body: any): Promise<{
        access_token: string;
        tenant: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    googleAuth(req: Request): Promise<void>;
    googleAuthRedirect(req: Request, res: Response): Promise<void>;
}
