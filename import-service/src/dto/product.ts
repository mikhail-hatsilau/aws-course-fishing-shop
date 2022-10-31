import { array, boolean, InferType, number, object, string } from 'yup';

export const productImageSchema = object({
  main: boolean(),
  source: string().required().default(''),
});

export const productSchema = object({
  title: string().required().default(''),
  description: string().required().default(''),
  price: number().required(),
  categoryId: string().uuid().required().default(''),
  count: number().required(),
  images: array(productImageSchema).required().default([]),
});

export const parsedProductSchema = object({
  title: string().required().default(''),
  description: string().required().default(''),
  price: string().required(),
  categoryId: string().uuid().required().default(''),
  count: string().required(),
  images: string().required().default(''),
});

export type Product = InferType<typeof productSchema>;
export type ParsedProduct = InferType<typeof parsedProductSchema>;
