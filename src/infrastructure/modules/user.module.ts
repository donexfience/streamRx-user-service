import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from 'src/presentation/controllers/user.controller';
import { UserRepository } from '../database/mongoose/repositories/user.repository';
import { CreateUserUseCase } from 'src/application/use-cases/createUserUsecase';
import { UserSchema, User } from '../database/mongoose/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserRepository, CreateUserUseCase],
})
export class UserModule {}
