import { InferType, object, string } from 'yup';

export const getProductsSchema = object({
  categoryId: string().uuid(),
});

export const getProductByIdPathParamsSchema = object({
  id: string().uuid().required(),
});

export type GetProductByIdPathParams = InferType<
  typeof getProductByIdPathParamsSchema
>;

export type GetProductsFilter = InferType<typeof getProductsSchema>;
