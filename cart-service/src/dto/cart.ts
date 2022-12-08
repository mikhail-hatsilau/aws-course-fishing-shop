import { object, string, InferType, number } from 'yup';

export const cartItemSchema = object({
  productId: string().uuid().required().default(''),
  count: number().required().default(0),
});

export const updateCartItemRequestSchema = object({
  id: string().uuid().required().default(''),
  count: number().required().min(0).default(0),
});

export type CartItemRequest = InferType<typeof cartItemSchema>;
export type UpdateCartItemRequest = InferType<
  typeof updateCartItemRequestSchema
>;
