import { object, string } from 'yup';

export const fileNameQuerySchema = object({
  fileName: string()
    .matches(/\.csv$/)
    .required(),
});
