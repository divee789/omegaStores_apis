import { Request, Response, NextFunction } from 'express';
import { NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import { NotAuthenticatedError } from '../../core/errors';
import db from '../../core/database/models';
import JWT from '../../core/services/jwt';

export const getAccessToken = (authorization: string) => {
  const authParams = authorization.split(' ');

  const authType = authParams[0];
  const authToken = authParams[1];

  if (authToken && authType.toLowerCase() === 'bearer') {
    return authToken;
  } else {
    throw new NotAuthenticatedError('no authorization token found');
  }
};

export const authenticateBearerToken = async (token: string) => {
  try {
    const decoded = await JWT.decode(token);
    return decoded;
  } catch (error) {
    return Promise.reject(error);
  }
};

const handle = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let claims: any;
      const authorization = req.headers.authorization;
      const authToken = getAccessToken(authorization);
      claims = await authenticateBearerToken(authToken);
      const user = await db.user.findByPk(claims.id);
      res.locals.claims = claims;
      res.locals.user = user;
      res.locals.token = authToken;
      next();
    } catch (err) {
      let _err = null;
      if (err instanceof TokenExpiredError) {
        _err = new NotAuthenticatedError(
          'provided token has expired',
          err,
        );
      } else if (err instanceof NotBeforeError) {
        _err = new NotAuthenticatedError(
          `provided token cannot be used before ${err.date.toISOString()}`,
          err,
        );
      } else {
        _err = new NotAuthenticatedError(
          'provided token is invalid',
          err,
        );
      }

      next(_err);
    }
  };
};

export default handle;
