export abstract class GenericRepository<T, Q = any> {
  abstract getAll(): Promise<T[]>;
  abstract getAll(query: Q): Promise<T[]>;
  abstract get(id: string): Promise<T | undefined>;
}
