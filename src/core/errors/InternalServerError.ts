import DomainError from './DomainError';

export default class InternalServerError extends DomainError {
  protected error_name: string = 'server_error';

  protected httpCode: number = 500;

  public constructor(
    message: string = 'Internal Server Error',
    error: Error = undefined,
    data: any = null,
    status: boolean = false,
  ) {
    super(message, error, data, status);
    Error.captureStackTrace(this, this.constructor);
  }
}
