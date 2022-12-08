import { UsersRepository } from './users.interface.repository';
import { User } from '../dto/user';
import { Injectable } from '@nestjs/common';

const users: User[] = [
  {
    id: 'b83a4c5a-db30-448c-943c-6b4ef2788667',
    username: 'mikhail-hatsilau',
    password: '$2b$10$TR5LDAEnFJZ66ft6u3xQGOHn0OEh1XiNq18rAhxnYB1EZDEhsosX6',
  },
  {
    id: '1c2c5566-d287-4399-95db-02cd9695309d',
    username: 'customer',
    password: '$2b$10$TR5LDAEnFJZ66ft6u3xQGOHn0OEh1XiNq18rAhxnYB1EZDEhsosX6',
  },
];

@Injectable()
export class MemoryUsersRepository implements UsersRepository {
  getAll(): Promise<User[]> {
    return Promise.resolve(users);
  }
}
