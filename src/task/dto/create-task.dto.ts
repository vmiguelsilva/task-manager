export class CreateTaskDto {
  title: string;
  summary: string;
  userId: string;
  performedAt: Date | null;
}
