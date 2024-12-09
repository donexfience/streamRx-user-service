import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export interface ICreateUserDto {
  username: string;
  email: string;
  password: string;
}

export class CreateUserDto implements ICreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}