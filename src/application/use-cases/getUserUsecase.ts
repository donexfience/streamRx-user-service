import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRepository } from './../../infrastructure/database/mongoose/repositories/user.repository';
import { ConflictException, Injectable } from '@nestjs/common';
@Injectable()
export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<UserEntity> {
    return this.userRepository.findByEmail(email);
  }
}
