export abstract class QueueRepository<T> {
  abstract send(message: T, attributes?: Record<string, any>): Promise<void>;
}
