import DomainError from './DomainError';

export default class NotAuthenticatedError extends DomainError {
  protected error_name: string = 'not_authenticated';

  protected httpCode: number = 401;

  public constructor(
    message: string = 'This Request Is Not Authenticated',
    error: Error = undefined,
    data: any = null,
    status: any = 401,
  ) {
    super(message, error, data, status);
    Error.captureStackTrace(this, this.constructor);
  }
}
