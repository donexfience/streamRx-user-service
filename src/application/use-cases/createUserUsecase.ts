import { UserEntity } from 'src/domain/entities/user.entity';
import { CreateUserDto, ICreateUserDto } from '../dtos/create-user.dto';
import { UserRepository } from './../../infrastructure/database/mongoose/repositories/user.repository';
import { ConflictException, Injectable } from '@nestjs/common';
@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: ICreateUserDto): Promise<UserEntity> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    console.log('inside usecase create');
    const userEntity = new UserEntity({
      
      username: dto.username,
      email: dto.email,
      bio:dto.bio,
      phone_number:dto.phoneNumber,
      role:dto.role,
      social_links:dto.social_links,
      date_of_birth:dto.dateOfBirth,

    });
    
    return this.userRepository.create(userEntity);
  }
}
