import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SocialLinksDto {
  @IsString()
  @IsOptional()
  twitter: string;

  @IsString()
  @IsOptional()
  instagram: string;

  @IsString()
  @IsOptional()
  youtube: string;
}

export class CreateStreamerRequestDto {
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  channelProfileImageURL: string | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  category: string[];

  @IsString()
  @IsOptional()
  channelName: string;

  @IsString()
  @IsOptional()
  message: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  @IsOptional()
  socialLinks: SocialLinksDto;

  @IsString()
  @IsOptional()
  experience: string;

  @IsString()
  @IsOptional()
  accessibility: string;
}
