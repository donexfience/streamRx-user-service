import { Types } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

export class UserEntity implements IUser {
  id?: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  phone_number?: string;
  date_of_birth?: string;
  profileImageURL?: string;
  social_links?: string;
  is_active: boolean;
  is_verified: boolean;
  role: string;
  bio?: string;
  google_id?: string;

  constructor(props: IUser) {
    this.id = props.id;
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();

    // Initialize new properties
    this.phone_number = props.phone_number;
    this.date_of_birth = props.date_of_birth;
    this.profileImageURL = props.profileImageURL;
    this.social_links = props.social_links;
    this.is_active = props.is_active !== undefined ? props.is_active : true;
    this.is_verified =
      props.is_verified !== undefined ? props.is_verified : false;
    this.role = props.role || 'VIEWER';
    this.bio = props.bio;
    this.google_id = props.google_id;
  }
  validateEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  validatePassword(): boolean {
    // Example password validation
    return this.password.length >= 8;
  }
}
