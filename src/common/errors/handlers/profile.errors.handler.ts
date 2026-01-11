import { ErrorTypes } from 'src/common/enums/error.types';
import { AppError } from '../app-error';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export function handleProfileError(error: unknown): never {
  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorTypes.INVALID_REQUEST_DATA:
      case ErrorTypes.INVALID_ID:
        throw new BadRequestException(error.message);
      case ErrorTypes.NOT_FOUND:
        throw new NotFoundException(error.message);
      default:
        throw new InternalServerErrorException(
          error.message || 'Internal server error',
        );
    }
  }
  if (error instanceof Error) {
    throw error;
  }

  throw new InternalServerErrorException('Internal Server Error');
}
