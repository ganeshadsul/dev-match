import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Db } from 'mongodb';
import { CreateProfileDTO } from './dto/create.profile.dto';
import { ObjectId } from 'mongodb';
import { UpdateProfileDTO } from './dto/update.profile.dto';
import { PatchProfileDTO } from './dto/patch.profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @Inject('MONGO_DB')
    private readonly db: Db,
  ) {}

  commonResponse(message: string) {
    return {
      status: 'success',
      message,
    };
  }

  async findAll() {
    return await this.db.collection('profiles').find().toArray();
  }

  async findOne(id: string) {
    return await this.db
      .collection('profiles')
      .findOne({ _id: new ObjectId(id) });
  }

  async create(data: CreateProfileDTO) {
    const res = await this.db.collection('profiles').insertOne(data);
    const profile = await this.db
      .collection('profiles')
      .findOne({ _id: res.insertedId });
    return profile;
  }

  async update(id: string, data: UpdateProfileDTO) {
    console.log('is valid', ObjectId.isValid(id));
    if (!ObjectId.isValid(id))
      throw new BadRequestException('Invalid proile id');

    const res = await this.db
      .collection('profiles')
      .updateOne({ _id: new ObjectId(id) }, { $set: data });

    if (res.matchedCount === 0) {
      throw new NotFoundException('Profile not found.');
    }
    return await this.db
      .collection('profiles')
      .findOne({ _id: new ObjectId(id) });
  }

  async patch(id: string, data: PatchProfileDTO) {
    if (!ObjectId.isValid(id))
      throw new BadRequestException('Invalid proile id');

    if (!data.name && !data.description) {
      throw new BadRequestException(
        'Request data incorrect: provide name or description',
      );
    }
    const res = await this.db
      .collection('profiles')
      .updateOne({ _id: new ObjectId(id) }, { $set: { ...data } });

    if (res.matchedCount === 0) {
      throw new NotFoundException('Profile not found.');
    }

    return await this.db
      .collection('profiles')
      .findOne({ _id: new ObjectId(id) });
  }
}
