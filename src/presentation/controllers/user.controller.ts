import { UpdateUserUseCase } from './../../application/use-cases/updateUserUsecase';
import { CreateUserUseCase } from './../../application/use-cases/createUserUsecase';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Injectable,
  OnModuleInit,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateUserDto } from 'src/application/dtos/create-user.dto';
import { IUpdateUserDto } from 'src/application/dtos/update-user.dto';
import {
  UpdateUserRequest,
  UpdateUserResponse,
} from 'src/domain/interfaces/userUpdate';
import {
  CreateUserRequest,
  CreateUserResponse,
  UserServiceControllerMethods,
} from 'src/generated/user';
import { RabbitMQProducer, RabbitMQConnection, QUEUES } from 'streamrx_common';

@Controller('users')
@UserServiceControllerMethods()
export class UserController implements OnModuleInit {
  private rabbitMQProducer: RabbitMQProducer;
  constructor(
    private CreateUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly rabbitMQConnection: RabbitMQConnection,
  ) {
    this.rabbitMQProducer = new RabbitMQProducer(rabbitMQConnection);
  }

  async onModuleInit() {
    await this.rabbitMQConnection.connect(
      process.env.RABBITMQ_HOST
        ? process.env.RABBITMQ_HOST
        : 'amqp://localhost',
    );
    this.rabbitMQProducer = new RabbitMQProducer(this.rabbitMQConnection);
  }

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
        role: userData.role || 'VIEWER',
        bio: userData.bio || '',
        profileImageUrl: userData.profileImageUrl || '',
        phoneNumber: userData.phoneNumber || '',
        dateOfBirth: userData.dateOfBirth || null,
        social_links: userData.social_links,
      };

      console.log('after dto conversion', createUserDto);
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

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() request: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    try {
      console.log(request.socialLinks, 'request');

      const updateUserDto: IUpdateUserDto = {
        email: request.email,
        username: request.username,
        role: request.role,
        bio: request.bio,
        profileImageUrl: request.profileImageUrl,
        phoneNumber: request.phoneNumber,
        dateOfBirth: request.dateOfBirth,
        social_links: request.socialLinks,
      };
      console.log(updateUserDto, 'hello passed type test');
      const updateUser = await this.updateUserUseCase.execute(
        updateUserDto,
        id,
      );
      const exchangeName = 'user-updated';
      await this.rabbitMQProducer.publishToExchange(
        exchangeName,
        '', 
        { id, ...updateUserDto }
      );
      return {
        success: true,
        message: 'User updated successfully',
        user: {
          email: updateUser.email,
          role: updateUser.role,
          username: updateUser.username,
          bio: updateUser.bio,
          date_of_birth: updateUser.date_of_birth,
          phone_number: updateUser.phone_number,
          profileImageURL: updateUser.profileImageURL,
        },
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        message: error.message || 'Failed to update user',
      };
    }
  }
}
