import { Entity } from '@/core/base';

export interface UserEntity extends Entity {
  name: string;
  password: string;
  email: string;
}
