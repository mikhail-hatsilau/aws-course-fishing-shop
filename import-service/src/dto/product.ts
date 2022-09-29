import { array, boolean, InferType, number, object, string } from 'yup';

export const productImageSchema = object({
  id: string().uuid().required().default(''),
  main: boolean(),
  source: string().required().default(''),
});

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
