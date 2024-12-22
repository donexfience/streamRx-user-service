import { InjectModel } from '@nestjs/mongoose';
import { IUserRepository } from '../interfaces/database-repository.interface';
import { Model, Types } from 'mongoose';
import { UserEntity } from 'src/domain/entities/user.entity';
import { User, UserDocument } from '../schemas/user.schema';
import { NotFoundException } from '@nestjs/common';
import { SocialLink } from 'src/domain/interfaces/user.interface';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = new this.userModel(user);
    console.log(user, 'user before database');
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

  async updateById(
    id: string,
    updateData: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const existingUser = await this.userModel.findById(id).exec();
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    console.log('Incoming update data:', updateData.social_links);
    console.log('Existing social links:', existingUser.social_links);

    if (updateData.social_links && Array.isArray(updateData.social_links)) {
      const existingLinks = existingUser.social_links || [];
      const mergedLinks: SocialLink[] = [...existingLinks];

      updateData.social_links.forEach((newLink: SocialLink) => {
        const existingLinkIndex = mergedLinks.findIndex(
          (link: SocialLink) =>
            link.platform === newLink.platform && link.url === newLink.url,
        );

        if (existingLinkIndex !== -1) {
          mergedLinks[existingLinkIndex] = {
            ...mergedLinks[existingLinkIndex],
            ...newLink,
          };
        } else {
          mergedLinks.push(newLink);
        }
      });
      const uniqueLinks = mergedLinks.filter(
        (link, index, self) =>
          index ===
          self.findIndex(
            (t) => t.platform === link.platform && t.url === link.url,
          ),
      );

      updateData.social_links = uniqueLinks;
    }

    if (updateData.tags && Array.isArray(updateData.tags)) {
      const existingTags = existingUser.tags || [];
      const updatedTags = Array.from(
        new Set([...existingTags, ...updateData.tags]),
      );
      updateData.tags = updatedTags;
    }

    console.log('Merged social links:', updateData.social_links);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();
    console.log(
      updatedUser,
      'updated user in the repository sending the data to the usecase',
    );
    return updatedUser ? this.toEntity(updatedUser) : null;
  }

  private toEntity(user: UserDocument): UserEntity {
    return new UserEntity({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date(),
      phone_number: user.phone_number,
      date_of_birth: user.date_of_birth,
      profileImageURL: user.profileImageURL,
      social_links:
        user.social_links && Array.isArray(user.social_links)
          ? user.social_links
          : [],
      role: user.role,
      bio: user.bio,
      tags: user.tags,
    });
  }
}
