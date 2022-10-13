export enum ProductErrorCodes {
  NOT_UNIQ = 'not_uniq',
}

export class ProductError extends Error {
  constructor(private _code: ProductErrorCodes, message: string) {
    super(message);
  }

  get code() {
    return this._code;
  }
}
