import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { DatabaseService } from '../configurations/database/database.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './entities/jwt-payload.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.databaseService.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials, check your email or password');
    }

    const decryptPass = await bcrypt.compare(password, user?.password);

    if (!decryptPass) {
      throw new UnauthorizedException('Invalid credentials, check your email or password');
    }

    const payload: JwtPayload = { email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
