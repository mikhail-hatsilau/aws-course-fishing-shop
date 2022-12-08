import { User } from '../dto/user';

export interface AuthorizationService {
  findUser(token: string): Promise<User | undefined>;
}
