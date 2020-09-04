import Joi from '@hapi/joi';
import { BadRequestError } from '../errors';
import { ProductSchemas } from './product';

class Validation {
  public productSchema = ProductSchemas;

  constructor() {}

  validate(data: any, schema: Joi.ObjectSchema<any>): Promise<any> {
    const { error, value } = schema.validate(data, {
      errors: { escapeHtml: true },
      abortEarly: false,
    });

    return new Promise((resolve, reject): void => {
      const buildErrorObject = (
        errors: Joi.ValidationErrorItem[],
      ): { message: string; customErrorMessage: string } | {} => {
        const customErrors = {};
        errors.forEach((item) => {
          if (
            !Object.prototype.hasOwnProperty.call(
              customErrors,
              item.path.join('.'),
            )
          ) {
            customErrors[item.path.join('.')] = {
              message: item.message.replace(/['"]+/g, ''),
            };
          }
        });

        return customErrors;
      };

      if (error) {
        const errorData = buildErrorObject(error.details);
        const errorObj = new BadRequestError(
          'Invalid Request Data',
          undefined,
          errorData,
        );

        return reject(errorObj);
      }

      return resolve(value);
    });
  }
}

export default Validation;
