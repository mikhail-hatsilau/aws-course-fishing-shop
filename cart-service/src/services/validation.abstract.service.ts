export abstract class ValidationService<BaseSchema> {
  abstract validate<S extends BaseSchema, T>(schema: S, data: T): Promise<T>;
}
