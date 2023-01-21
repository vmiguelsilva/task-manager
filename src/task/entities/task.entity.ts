import { Prisma } from '@prisma/client';

const taskMetadata = Prisma.validator<Prisma.TaskArgs>()({});

type ITaskMetadata = Prisma.TaskGetPayload<typeof taskMetadata>;

export class Task implements ITaskMetadata {
  id: string;
  title: string;
  summary: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  performedAt: Date | null;
}
