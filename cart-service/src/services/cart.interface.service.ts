import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cartItem.entity';
import { CartItemRequest, UpdateCartItemRequest } from '../dto/cart';

export interface CartService {
  getUserCart(userId: string): Promise<Cart | null>;
  addToCart(userId: string, cartItem: CartItemRequest): Promise<CartItem>;
  removeFromCart(userId: string, cartItemId: string): Promise<void>;
  updateCartItem(
    userId: string,
    cartItemRequest: UpdateCartItemRequest,
  ): Promise<CartItem>;
}
