export interface IUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  phone_number?: string;
  date_of_birth?: Date;
  profileImageURL?: string;
  social_links?: string;
  is_active?: boolean;
  is_verified?: boolean;
  role?: string;
  bio?: string;
  google_id?: string;
}
