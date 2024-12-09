import { Body, Controller, Injectable, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from 'src/application/dtos/create-user.dto';
import { CreateUserUseCase } from 'src/application/use-cases/createUserUsecase';
import { UserEntity } from 'src/domain/entities/user.entity';

@Controller()
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}
  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
    const createdUser = await this.createUserUseCase.execute(createUserDto);
    
    // Remove sensitive information
    return {
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email
    };
  }
}

