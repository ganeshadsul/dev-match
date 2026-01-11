import { IsOptional, IsString, Length } from 'class-validator';

export class PatchProfileDTO {
  @IsOptional()
  @IsString()
  @Length(3, 20)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(20, 200)
  description?: string;
}
