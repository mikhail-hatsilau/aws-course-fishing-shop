import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CartService } from './cart.interface.service';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cartItem.entity';
import { CartItemRequest, UpdateCartItemRequest } from '../dto/cart';
import { CartError, CartErrorCodes } from '../helpers/errors/productError';

@Injectable()
export class DefaultCartService implements CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
  ) {}

  async getUserCart(userId: string): Promise<Cart | null> {
    return this.cartRepository.findOneBy({ userId });
  }

  async addToCart(
    userId: string,
    cartItemRequest: CartItemRequest,
  ): Promise<CartItem> {
    const cartItem = new CartItem();
    cartItem.productId = cartItemRequest.productId;
    cartItem.count = cartItemRequest.count;

    let cart = await this.cartRepository.findOneBy({ userId });
    cart = cart
      ? await this.updateExistingCart(cart, cartItem)
      : await this.createNewCart(userId, cartItem);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return cart.items.find(
      (updatedItem) => updatedItem.productId === cartItem.productId,
    )!;
  }

  private async updateExistingCart(
    cart: Cart,
    cartItem: CartItem,
  ): Promise<Cart> {
    const existingCartItem = cart.items.find(
      (item) => item.productId === cartItem.productId,
    );
    if (existingCartItem) {
      existingCartItem.count = cartItem.count;
    } else {
      cart.items.push(cartItem);
    }
    cart.updatedAt = new Date().toISOString();
    return this.cartRepository.save(cart);
  }

  private async createNewCart(
    userId: string,
    cartItem: CartItem,
  ): Promise<Cart> {
    const cart = new Cart();
    cart.userId = userId;
    cart.createdAt = new Date().toISOString();
    cart.updatedAt = cart.createdAt;
    cart.items = [cartItem];

    return this.cartRepository.save(cart);
  }

  async removeFromCart(userId: string, cartItemId: string): Promise<void> {
    const cart = await this.cartRepository.findOneBy({ userId });

    if (!cart) {
      throw new CartError(
        CartErrorCodes.CART_NOT_FOUND,
        'Can not find cart for the user',
      );
    }

    cart.items = cart.items.filter((item) => item.id !== cartItemId);
    cart.updatedAt = new Date().toISOString();

    await this.cartRepository.save(cart);
  }

  async updateCartItem(
    userId: string,
    cartItemRequest: UpdateCartItemRequest,
  ): Promise<CartItem> {
    const cart = await this.cartRepository.findOneBy({ userId });

    if (!cart) {
      throw new CartError(
        CartErrorCodes.CART_NOT_FOUND,
        'Can not find cart for the user',
      );
    }

    cart.items = cart.items.map((item) =>
      item.id === cartItemRequest.id
        ? { ...item, count: cartItemRequest.count }
        : item,
    );
    cart.updatedAt = new Date().toISOString();

    await this.cartRepository.save(cart);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return cart.items.find((item) => item.id === cartItemRequest.id)!;
  }
}
