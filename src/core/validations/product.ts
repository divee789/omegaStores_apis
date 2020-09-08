import * as Joi from '@hapi/joi';
const { object, string } = Joi.types();

export class ProductSchemas {
  static create = object.keys({
    name: string.trim().required(),
    price: string.trim().required(),
    image_url: string.trim().required(),
    description: string.trim().required(),
    category: string
      .trim()
      .required()
      .valid('vehicles', 'clothing', 'tech'),
    contact: string.trim().required(),
  });
}
