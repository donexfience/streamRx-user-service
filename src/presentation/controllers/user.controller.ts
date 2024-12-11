import { CreateUserUseCase } from './../../application/use-cases/createUserUsecase';
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
import { UserEntity } from 'src/domain/entities/user.entity';
import {
  CreateUserRequest,
  CreateUserResponse,
  UserServiceControllerMethods,
} from 'src/generated/user';

@Controller()
@UserServiceControllerMethods()
export class UserController {
  constructor(private CreateUserUseCase: CreateUserUseCase) {}
  @GrpcMethod('UserService', 'createUser')
  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      console.log(
        'Recived user creation request',
        JSON.stringify(request, null, 2),
      );
      const userData = request.user;
      if (!userData) {
        console.error('No user data provided in the requeste');
        return {
          success: false,
          message: 'No user data provided',
        };
      }
      const createUserDto: CreateUserDto = {
        email: userData.email,
        username: userData.username,
        password: userData.hashedPassword,
        role: userData.role || 'VIEWER',
        bio: userData.bio || '',
        isVerified: userData.isVerified ?? true,
        profileImageUrl: userData.profileImageUrl || '',
        isActive: userData.isActive ?? true,
        phoneNumber: userData.phoneNumber || '',
        dateOfBirth: userData.dateOfBirth || null,
        social_links: userData.social_links || '',
        google_id: userData.google_id || '',
      };

      console.log('after dto conversion', createUserDto);
      // Use your use case to create the user
      const createdUser = await this.CreateUserUseCase.execute(createUserDto);

      return {
        success: true,
        message: 'User created successfully',
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        message: error.message || 'Failed to create user',
      };
    }
  }
}
