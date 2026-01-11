import { IsString, Length } from 'class-validator';

export class CreateProfileDTO {
  @IsString()
  @Length(3, 20)
  name: string;

  @IsString()
  @Length(20, 200)
  description: string;
}
