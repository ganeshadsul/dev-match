import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDTO } from './dto/create.profile.dto';
import { UpdateProfileDTO } from './dto/update.profile.dto';
import { PatchProfileDTO } from './dto/patch.profile.dto';
import { handleProfileError } from 'src/common/errors/handlers/profile.errors.handler';
import { ObjectIdPipe } from 'src/common/pipes/object-id.pipe';
import { ObjectId } from 'mongodb';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileServive: ProfileService) {}

  // route: /profile GET
  @Get()
  async findAll() {
    const data = await this.profileServive.findAll();
    const res = this.profileServive.commonResponse('Profiles found.');
    return {
      ...res,
      data: {
        meta: {
          count: data.length,
        },
        payload: data,
      },
    };
  }

  // route: /profile/:id GET
  @Get(':id')
  async findOne(@Param('id', ObjectIdPipe) id: ObjectId) {
    try {
      const profile = await this.profileServive.findOne(id);
      const res = this.profileServive.commonResponse('Profile Found.');
      return { ...res, data: profile };
    } catch (error: unknown) {
      handleProfileError(error);
    }
  }

  // route /profile POST
  @Post()
  async create(@Body() createProfileDTO: CreateProfileDTO) {
    const { name, description } = createProfileDTO;
    const res = this.profileServive.commonResponse(
      'Profile created successfully.',
    );
    const data = await this.profileServive.create({ name, description });
    return { ...res, data };
  }

  // route /profile/:id PUT
  @Put(':id')
  async update(
    @Param('id', ObjectIdPipe) id: ObjectId,
    @Body() updateProfileDTO: UpdateProfileDTO,
  ) {
    try {
      const res = this.profileServive.commonResponse(
        'Profile updated successfully.',
      );
      const profile = await this.profileServive.update(id, updateProfileDTO);
      return { ...res, data: { profile } };
    } catch (error) {
      handleProfileError(error);
    }
  }

  // route /profile/:id PATCH
  @Patch(':id')
  async patch(
    @Param('id', ObjectIdPipe) id: ObjectId,
    @Body() patchProfileDTO: PatchProfileDTO,
  ) {
    try {
      const res = this.profileServive.commonResponse(
        'Profile patched successfully.',
      );
      const data = await this.profileServive.patch(id, patchProfileDTO);
      return { ...res, data };
    } catch (error) {
      handleProfileError(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ObjectIdPipe) id: ObjectId) {
    try {
      await this.profileServive.delete(id);
    } catch (error: unknown) {
      handleProfileError(error);
    }
  }
}
