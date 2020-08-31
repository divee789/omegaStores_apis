import DomainError from './DomainError';

export default class BadRequestError extends DomainError {
  protected error_name: string = 'bad_request';
  protected httpCode: number = 400;

  constructor(
    message: string = 'Bad Request Data',
    error: Error = undefined,
    data: any = null,
    status: boolean = false,
  ) {
    super(message, error, data, status);
    Error.captureStackTrace(this, this.constructor);
  }
}
