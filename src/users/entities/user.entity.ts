import { Prisma, Role } from '@prisma/client';

const userMetadata = Prisma.validator<Prisma.UserArgs>()({});

type IUserMetadata = Prisma.UserGetPayload<typeof userMetadata>;

export class User implements IUserMetadata {
  id: string;
  email: string;
  name: string;
  role: Role;
  tasks: string[];
  createdAt: Date;
  updatedAt: Date;
}
