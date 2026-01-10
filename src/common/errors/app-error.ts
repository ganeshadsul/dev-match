import { ErrorMessages } from '../enums/error.message';
import { ErrorTypes } from '../enums/error.types';

export class AppError extends Error {
  constructor(
    public readonly type: ErrorTypes,
    public readonly message: string = ErrorMessages[type] as string,
  ) {
    super(message);
    this.name = this.constructor.name;
    if (process.env.NODE_ENV !== 'production') {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
