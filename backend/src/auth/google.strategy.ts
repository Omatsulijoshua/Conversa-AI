import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private config: ConfigService) {
    super(({
      clientID: config.get<string>('GOOGLE_CLIENT_ID') || 'disabled-google-client-id',
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET') || 'disabled-google-client-secret',
      callbackURL: `${config.get<string>('BASE_URL') || 'https://conversa-backend-6bou.onrender.com'}/api/v1/auth/google/callback`,
      scope: ['email', 'profile'],
    } as unknown) as any);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
