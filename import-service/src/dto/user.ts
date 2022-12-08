import { object, string, InferType } from 'yup';

export const userDtoSchema = object({
  id: string().uuid().required().default(''),
  username: string().required().default(''),
  password: string().required().default(''),
});

export type User = InferType<typeof userDtoSchema>;
