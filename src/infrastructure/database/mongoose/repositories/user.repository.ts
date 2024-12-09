import { InjectModel } from '@nestjs/mongoose';
import { IUserRepository } from '../interfaces/database-repository.interface';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { UserEntity } from 'src/domain/entities/user.entity';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();
    return this.toEntity(savedUser);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ email });
    return user ? this.toEntity(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userModel.findById(id);
    return user ? this.toEntity(user) : null;
  }
  private toEntity(user: UserDocument): UserEntity {
    return new UserEntity({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      password: user.hashed_password,
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date(),
      phone_number: user.phone_number,
      date_of_birth: user.date_of_birth,
      profileImageURL: user.profileImageURL,
      social_links: user.social_links,
      is_active: user.is_active,
      is_verified: user.is_verified,
      role: user.role,
      bio: user.bio,
      google_id: user.google_id,
    });
  }
}
