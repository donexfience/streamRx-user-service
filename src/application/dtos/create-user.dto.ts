import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { SocialLink } from 'src/domain/interfaces/user.interface';

export interface ICreateUserDto {
  username: string;
  email: string;
  role?: string;
  bio?: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  social_links?: SocialLink[];
  tags: [];
}

export class CreateUserDto implements ICreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  role: string = 'VIEWER';

  @IsOptional()
  bio: string = '';

  @IsOptional()
  profileImageUrl: string = '';

  @IsOptional()
  @IsNotEmpty()
  phoneNumber: string = '';

  @IsOptional()
  dateOfBirth: string = '';

  @IsOptional()
  social_links: SocialLink[] = [];

  @IsOptional()
  tags: [] = [];
}
