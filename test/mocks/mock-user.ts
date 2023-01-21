import { faker } from '@faker-js/faker';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const mockUser = async (role: Role, customPass = 'password') => {
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash(customPass, salt);

  return {
    password,
    role,
    id: faker.datatype.uuid(),
    email: faker.internet.email(),
    name: faker.internet.userName(),
    tasks: faker.random.words(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
};
