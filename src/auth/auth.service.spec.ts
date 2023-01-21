import { faker } from '@faker-js/faker';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';

import { mockCredentials, mockUser } from '../../test/mocks';
import { DatabaseService } from '../configurations/database/database.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let databaseService: DatabaseService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [AuthService, JwtService, DatabaseService]
    }).compile();

    service = module.get<AuthService>(AuthService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('return accessToken on signIn is successful', async () => {
    const credentials: LoginDto = mockCredentials();
    const user = await mockUser(Role.TECHNICIAN);

    jest.spyOn(databaseService.user, 'findUnique').mockResolvedValueOnce({ ...user });
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('accessToken');

    const result = await service.signIn(credentials);
    expect(result.accessToken).toBeDefined();
  });

  it('return unauthorized error if password is invalid', async () => {
    const credentials: LoginDto = mockCredentials(faker.internet.password());
    const user = await mockUser(Role.TECHNICIAN);

    jest.spyOn(databaseService.user, 'findUnique').mockResolvedValueOnce(user);

    const promise = service.signIn(credentials);
    await expect(promise).rejects.toThrow();
  });

  it('return unauthorized error if user not found', async () => {
    const credentials: LoginDto = mockCredentials();

    jest.spyOn(databaseService.user, 'findUnique').mockResolvedValueOnce(null);

    const promise = service.signIn(credentials);

    await expect(promise).rejects.toThrow();
  });
});
