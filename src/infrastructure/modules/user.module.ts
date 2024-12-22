import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from 'src/presentation/controllers/user.controller';
import { UserRepository } from '../database/mongoose/repositories/user.repository';
import { CreateUserUseCase } from 'src/application/use-cases/createUserUsecase';
import { UserSchema, User } from '../database/mongoose/schemas/user.schema';
import { UpdateUserUseCase } from 'src/application/use-cases/updateUserUsecase';
import { RabbitMQConnection } from 'streamrx_common';
import { GetUserUseCase } from 'src/application/use-cases/getUserUsecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserRepository, CreateUserUseCase,UpdateUserUseCase,RabbitMQConnection,GetUserUseCase],
})
export class UserModule {}
