import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { DatabaseService } from '../configurations/database/database.service';
import { JwtPayload } from './entities/jwt-payload.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  async validate(payload: JwtPayload) {
    const { email } = payload;

    const user = await this.databaseService.user.findUnique({
      where: { email },
      select: { id: true, role: true, email: true }
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
