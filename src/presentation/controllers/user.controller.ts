import { GetUserUseCase } from './../../application/use-cases/getUserUsecase';
import { UserRepository } from './../../infrastructure/database/mongoose/repositories/user.repository';
import { UpdateUserUseCase } from './../../application/use-cases/updateUserUsecase';
import { CreateUserUseCase } from './../../application/use-cases/createUserUsecase';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  OnModuleInit,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateUserDto } from 'src/application/dtos/create-user.dto';
import { IUpdateUserDto } from 'src/application/dtos/update-user.dto';
import {
  getUserRequest,
  getUserResponse,
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
    private UserRepository: UserRepository,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private GetUserUseCase: GetUserUseCase,
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
        tags: userData.tags || [],
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

  @Get('/getUser')
  @HttpCode(HttpStatus.OK)
  async getUser(@Query('email') email: string): Promise<getUserResponse> {
    try {
      if (!email) {
        return {
          success: false,
          message: 'email is required',
        };
      }
      const user = await this.GetUserUseCase.execute(email);
      console.log(user,"user get");
      return {
        success: true,
        message: 'User get successfully',
        user: {
          email: user.email,
          role: user.role,
          username: user.username,
          bio: user.bio,
          date_of_birth: user.date_of_birth,
          phone_number: user.phone_number,
          profileImageURL: user.profileImageURL,
          social_links: user.social_links,
          tags: user.tags,
        },
      };
    } catch (error: any) {
      console.error('Error updating user:', error);
      return {
        success: false,
        message: error.message || 'Failed to update user',
      };
    }
  }

  @Put('/updateUser/:email')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('email') email: string,
    @Body() request: any,
  ): Promise<UpdateUserResponse> {
    console.log('Received body:', request);
    console.log('hello sanam kiitye');
    try {
      if (!email) {
        return {
          success: false,
          message: 'Email is required',
        };
      }
      if (!request || Object.keys(request).length === 0) {
        return {
          success: false,
          message: 'Please provide data to update',
        };
      }

      console.log('Received Request:', request);

      const currentUser = await this.UserRepository.findByEmail(email);
      if (!currentUser) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const updateUserDto: IUpdateUserDto = {
        username: request.username,
        role: request.role,
        bio: request.bio,
        profileImageURL: request.profileImageURL,
        phoneNumber: request.phoneNumber,
        dateOfBirth: request.dateOfBirth,
        social_links: request.socialLinks,
        email,
        tags:request.tags
      };

      console.log('DTO for Update:', updateUserDto);

      const updatedUser = await this.updateUserUseCase.execute(
        updateUserDto,
        currentUser.id.toString(),
      );

      // Publish update to RabbitMQ
      const exchangeName = 'user-updated';
      await this.rabbitMQProducer.publishToExchange(exchangeName, '', {
        id: currentUser.id,
        ...updateUserDto,
      });

      return {
        success: true,
        message: 'User updated successfully',
        user: {
          email: updatedUser.email,
          role: updatedUser.role,
          username: updatedUser.username,
          bio: updatedUser.bio,
          date_of_birth: updatedUser.date_of_birth,
          phone_number: updatedUser.phone_number,
          profileImageURL: updatedUser.profileImageURL,
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
