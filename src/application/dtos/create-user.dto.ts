import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsDate, IsBoolean } from 'class-validator';

export interface ICreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: string;
  bio?: string; 
  isVerified?: boolean;
  profileImageUrl?: string;
  isActive?: boolean;
  phoneNumber?: string; 
  dateOfBirth?:string;
  social_links?:string
  google_id?:string
}

export class CreateUserDto implements ICreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsNotEmpty()
  role: string = 'VIEWER'; 

  @IsOptional()
  bio: string = '';

  @IsOptional()
  @IsBoolean()
  isVerified: boolean = true; 

  @IsOptional()
  profileImageUrl: string = '';

  @IsOptional()
  @IsBoolean()
  isActive: boolean = true; 

  @IsOptional()
  @IsNotEmpty()
  phoneNumber: string = '';

  @IsOptional()
  dateOfBirth: string = '';


  @IsOptional()
  social_links: string = '';

  @IsOptional()
  google_id?: string='';
}
