import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/infrastructure/database/mongoose/repositories/user.repository';
import { IUpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UpdateUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userEmail: string, role: string): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(userEmail);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedData: Partial<UserEntity> = {
      role: role || existingUser.role,
    };
    console.log('user repositoyr before', updatedData);
    return this.userRepository.updateByEmail(userEmail, updatedData);
  }
}
