import { array, boolean, InferType, number, object, string } from 'yup';

export const productImageSchema = object({
  id: string().uuid().required().default(''),
  main: boolean(),
  source: string().required().default(''),
});

export const createProductImageRequestSchema = object({
  main: boolean(),
  source: string().required().default(''),
});

export type ProductImage = InferType<typeof productImageSchema>;

export const productSchema = object({
  id: string().uuid().required().default(''),
  title: string().required().default(''),
  description: string().required().default(''),
  price: number().required(),
  categoryId: string().uuid().required().default(''),
  count: number().required(),
  images: array(productImageSchema).required().default([]),
});

export type Product = InferType<typeof productSchema>;

export const createProductRequestSchema = object({
  title: string().required().default(''),
  description: string().required().default(''),
  price: number().required(),
  categoryId: string().uuid().required().default(''),
  count: number().required(),
  images: array(createProductImageRequestSchema).required().default([]),
});

export type CreateProductRequest = InferType<typeof createProductRequestSchema>;

export interface ProductRow {
  id: string;
  title: string;
  description: string;
  price: number;
  category_id: string;
  count: number;
  image_id: string;
  image_source: string;
  main_image: boolean;
}
