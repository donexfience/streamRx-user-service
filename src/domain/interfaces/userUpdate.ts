import { UserEntity } from '../entities/user.entity';
import { SocialLink } from './user.interface';

export interface UpdateUserRequest {
  email?: string;
  username?: string;
  role?: string;
  bio?: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  socialLinks?: SocialLink[];
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  user?: {
    email: string;
    username: string;
    phone_number?: string;
    date_of_birth?: string;
    profileImageURL?: string;
    social_links?: string[];
    role: string;
    bio?: string;
  };
}
