import { Request, Response, NextFunction } from 'express';
import DomainError from '../../core/errors/DomainError';
import logger from '../../core/utils/logger';

function handle(
  _err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): any {
  if (_err instanceof DomainError) {
    const err = _err as DomainError;

    const errorData = {
      status: err.getStatus(),
      error: err.getName(),
      message: err.message,
      data: {},
    };

    if (err.getData() !== undefined) {
      errorData.data = err.getData();
    }
    res.status(_err.getHttpCode()).json(errorData);
  } else {
    logger.error('Something has gone wrong. Unhandled error', _err);

    res.status(500).json({
      status: false,
      message:
        'Internal server error. It would be nice if you report this to us.',
      data: null,
    });
  }
}

export default handle;
