export abstract class GenericRepository<T, Q = Partial<T>> {
  abstract getAll(): Promise<T[]>;
  abstract getAll(query: Q): Promise<T[]>;
  abstract get(id: string): Promise<T | undefined>;
  abstract insert(data: Omit<T, 'id'>): Promise<T>;
}
