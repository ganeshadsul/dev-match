import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Collection, Db } from 'mongodb';
import { CreateProfileDTO } from './dto/create.profile.dto';
import { ObjectId } from 'mongodb';
import { UpdateProfileDTO } from './dto/update.profile.dto';
import { PatchProfileDTO } from './dto/patch.profile.dto';

@Injectable()
export class ProfileService {
  private readonly profileCollection: Collection;
  constructor(
    @Inject('MONGO_DB')
    private readonly db: Db,
  ) {
    this.profileCollection = this.db.collection('profiles');
  }

  commonResponse(message: string) {
    return {
      status: 'success',
      message,
    };
  }

  // get all profiles
  async findAll() {
    return await this.profileCollection.find().toArray();
  }

  // find one profile by id
  async findOne(id: string) {
    return await this.profileCollection.findOne({ _id: new ObjectId(id) });
  }

  // create new profile
  async create(data: CreateProfileDTO) {
    const res = await this.profileCollection.insertOne(data);
    // retreiving created profile data
    const profile = await this.profileCollection.findOne({
      _id: res.insertedId,
    });

    return profile;
  }

  // update whole profile object
  async update(id: string, data: UpdateProfileDTO) {
    // checking if id is valid
    if (!ObjectId.isValid(id))
      throw new BadRequestException('Invalid proile id');

    // updating profile
    const res = await this.profileCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
    );

    // checking if profile corrospoing to profile was updated or not
    if (res.matchedCount === 0) {
      throw new NotFoundException('Profile not found.');
    }

    // returning updated profile
    return await this.profileCollection.findOne({ _id: new ObjectId(id) });
  }

  // update a part of the profile object
  async patch(id: string, data: PatchProfileDTO) {
    // checking if id is valid
    if (!ObjectId.isValid(id))
      throw new BadRequestException('Invalid proile id');

    // validating whether there is atlest one parmeter to patch
    if (!data.name && !data.description) {
      throw new BadRequestException(
        'Request data incorrect: provide name or description',
      );
    }

    // updating profile object
    const res = await this.profileCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data } },
    );

    // checking if profile corrospoing to profile was updated or not
    if (res.matchedCount === 0) {
      throw new NotFoundException('Profile not found.');
    }

    // returning updated profile
    return await this.profileCollection.findOne({ _id: new ObjectId(id) });
  }

  // delete profile
  async delete(id: string) {
    // checking if id is valid
    if (!ObjectId.isValid(id))
      throw new BadRequestException('Invalid profile id');

    // deleting profile
    const res = await this.profileCollection.deleteOne({
      _id: new ObjectId(id),
    });

    // checking if profile corrospoing to profile was updated or not
    if (res.deletedCount === 0) {
      throw new NotFoundException('Profile not found.');
    }
    return null;
  }
}
