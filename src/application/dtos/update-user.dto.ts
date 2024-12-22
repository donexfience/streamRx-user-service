import { SocialLink } from 'src/domain/interfaces/user.interface';

// update-user.dto.ts
export interface IUpdateUserDto {
  username?: string;
  password?: string;
  bio?: string;
  isActive?: boolean;
  isVerified?: boolean;
  phoneNumber?: string;
  profileImageURL: string;
  role?: string;
  social_links?: SocialLink[];
  dateOfBirth?: string;
  google_id?: string;
  email?: string;
  tags:[]

}

export class UpdateUserDto implements IUpdateUserDto {
  username?: string;
  password?: string;
  bio?: string;
  isActive?: boolean;
  isVerified?: boolean;
  phoneNumber?: string;
  role?: string;
  profileImageURL: string;
  social_links?: SocialLink[];
  dateOfBirth?: string;
  google_id?: string;
  email?: string;
  tags:[]
}
