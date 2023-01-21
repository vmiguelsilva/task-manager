import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const db = new PrismaClient();

const createUser = async (role: Role) => {
  const salt = await bcrypt.genSalt();
  const hashedPass = await bcrypt.hash('sword-pass', salt);
  const email = `${role.toLowerCase()}@miguel.com`;

  const query = {
    where: { email },
    update: {},
    create: {
      role,
      email,
      name: role.toString(),
      password: hashedPass
    }
  };

  return db.user.upsert(query);
};

(async () => {
  try {
    await createUser(Role.MANAGER);
    await createUser(Role.TECHNICIAN);
  } catch (error) {
    console.error(error);
  }
  await db.$disconnect();
})();
