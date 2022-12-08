export enum CartErrorCodes {
  CART_NOT_FOUND = 'cart_not_found',
  CART_ITEM_NOT_FOUND = 'cart_item_not_found',
}

export class CartError extends Error {
  constructor(private _code: CartErrorCodes, message: string) {
    super(message);
  }

  get code() {
    return this._code;
  }
}
