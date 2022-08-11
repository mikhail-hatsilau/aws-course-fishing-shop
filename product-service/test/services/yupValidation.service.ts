import { BaseSchema } from 'yup';
import { YupValidationService } from '../../src/services/yupValidation.service';

const validateRejectMock = {
  value: {
    categoryId: '123',
  },
  path: 'categoryId',
  type: 'uuid',
  errors: ['categoryId must be a valid UUID'],
  params: {
    value: '123',
    originalValue: '123',
    path: 'categoryId',
    regex: {},
  },
  inner: [],
  name: 'ValidationError',
  message: 'categoryId must be a valid UUID',
};

describe('ValidationService', () => {
  let validationService: YupValidationService;
  let schema: BaseSchema;
  let validateMock: jest.Mock;

  beforeEach(() => {
    validateMock = jest.fn();
    validationService = new YupValidationService();
    schema = {
      validate: validateMock,
    } as unknown as BaseSchema;
  });

  it('should call validate function on passed schema and return result of it', async () => {
    validateMock.mockReturnValue(Promise.resolve({ a: 1 }));
    const validationResult = await validationService.validate(schema, {
      categoryId: '123',
    });

    expect(validationResult).toEqual({
      categoryId: '123',
    });
  });

  it('should reject promise with error', async () => {
    validateMock.mockRejectedValue(validateRejectMock);
    await expect(
      validationService.validate(schema, {
        categoryId: '123',
      }),
    ).rejects.toEqual(validateRejectMock);
  });
});
