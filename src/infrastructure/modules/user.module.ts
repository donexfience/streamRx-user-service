import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../database/mongoose/schemas/user.schema';
import { UserController } from 'src/presentation/controllers/user.controller';
import { UserRepository } from '../database/mongoose/repositories/user.repository';
import { CreateUserUseCase } from 'src/application/use-cases/createUserUsecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserRepository, CreateUserUseCase],
})
export class UserModule {}
