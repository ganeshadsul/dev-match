import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ErrorMessages } from '../enums/error.message';

@Injectable()
export class ObjectIdPipe implements PipeTransform<string, ObjectId> {
  transform(value: string): ObjectId {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException(ErrorMessages.INVALID_ID);
    }
    return new ObjectId(value);
  }
}
