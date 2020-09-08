import * as Joi from '@hapi/joi';
const { object, string } = Joi.types();

export class AuthSchemas {
  static signUp = object.keys({
    first_name: string.trim().email().required(),
    last_name: string.trim().required(),
    email: string.trim().required(),
    password: string.trim().min(6).required(),
  });

  static logIn = object.keys({
    email: string.trim().email().required(),
    password: string.trim().required(),
  });

  static facebookAuth = object.keys({
    userID: string.trim().required(),
    token: string.trim().required(),
  });

  static googleAuth = object.keys({
    token: string.trim().required(),
  });
}
