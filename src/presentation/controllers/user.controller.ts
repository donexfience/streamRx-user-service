import {
  Body,
  Controller,
  Injectable,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateUserDto } from 'src/application/dtos/create-user.dto';
import { CreateUserUseCase } from 'src/application/use-cases/createUserUsecase';
import { UserEntity } from 'src/domain/entities/user.entity';
import { CreateUserRequest, CreateUserResponse, UserServiceControllerMethods } from 'src/generated/user';
import { UserService } from 'src/infrastructure/service/user.service';

@Controller()
@UserServiceControllerMethods()
export class UserController {
  @GrpcMethod('UserService', 'createUser')
  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    console.log('Received user creation request:', request);
    return {
      success: true,
      message: 'User created successfully',
    };
  }

}
