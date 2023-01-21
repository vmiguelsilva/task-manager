import { faker } from '@faker-js/faker';

export const mockTask = () => ({
  title: faker.random.word(),
  summary: faker.random.word(),
  performedAt: null,
  userId: faker.datatype.uuid(),
  id: faker.random.word(),
  createdAt: new Date(),
  updatedAt: new Date()
});
