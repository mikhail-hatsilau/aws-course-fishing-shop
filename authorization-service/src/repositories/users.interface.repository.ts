import { User } from '../dto/user';

export interface UsersRepository {
  getAll(): Promise<User[]>;
}
