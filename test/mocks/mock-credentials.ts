import { faker } from '@faker-js/faker';

import { LoginDto } from '../../src/auth/dto/login.dto';

export const mockCredentials = (password = 'password'): LoginDto => ({
  password,
  email: faker.internet.email()
});
