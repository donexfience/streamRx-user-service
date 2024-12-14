import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/infrastructure/database/mongoose/repositories/user.repository';
import { IUpdateUserDto } from '../dtos/update-user.dto';


@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: IUpdateUserDto, userId: string): Promise<UserEntity> {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
  
    if (dto.email && dto.email !== existingUser.email) {
      throw new ConflictException('Email cannot be updated');
    }
  
    const updatedData: Partial<UserEntity> = {
      username: dto.username?.trim() || existingUser.username,
      bio: dto.bio || existingUser.bio,
      phone_number: dto.phoneNumber || existingUser.phone_number,
      role: dto.role || existingUser.role,
      date_of_birth: dto.dateOfBirth || existingUser.date_of_birth,
      social_links:dto.social_links || existingUser.social_links
    };
    console.log('user repositoyr before',updatedData)
    return this.userRepository.updateById(userId, updatedData);
  }
  
}

