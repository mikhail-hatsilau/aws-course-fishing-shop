import { User } from '../dto/user';

export interface PolicyBuilder<T> {
  buildAllowPolicy(principal: string, resource: string, user: User): T;
  buildDenyPolicy(principal: string, resource: string): T;
}
