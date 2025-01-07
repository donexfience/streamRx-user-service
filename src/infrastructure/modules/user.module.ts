import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from 'src/presentation/controllers/user.controller';
import { UserRepository } from '../database/mongoose/repositories/user.repository';
import { CreateUserUseCase } from 'src/application/use-cases/createUserUsecase';
import { UserSchema, User } from '../database/mongoose/schemas/user.schema';
import { UpdateUserUseCase } from 'src/application/use-cases/updateUserUsecase';
import { RabbitMQConnection } from 'streamrx_common';
import { GetUserUseCase } from 'src/application/use-cases/getUserUsecase';
import { CreateRequestUseCase } from 'src/application/use-cases/streamer-Requeset/createRequest';
import { GetAllRequest } from 'src/application/use-cases/streamer-Requeset/getAllRequest';
import { UpdateRequestStatusUseCase } from 'src/application/use-cases/streamer-Requeset/updateRequest';
import { GetRequestByIdUseCase } from 'src/application/use-cases/streamer-Requeset/getRequestById';
import { StreamerRequeset, StreamerRequestSchema } from '../database/mongoose/schemas/streamerRequsetSchema';
import { StreamerRequestRepository } from '../database/mongoose/repositories/streamerRequest.respository';
import { GetRequestByEmailUseCase } from 'src/application/use-cases/streamer-Requeset/getRequestByEmail';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: StreamerRequeset.name, schema: StreamerRequestSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserRepository,
    StreamerRequestRepository,
    CreateUserUseCase,
    UpdateUserUseCase,
    RabbitMQConnection,
    GetUserUseCase,
    CreateRequestUseCase,
    GetAllRequest,
    UpdateRequestStatusUseCase,
    GetRequestByIdUseCase,
    GetRequestByEmailUseCase
  ],
})
export class UserModule {}
