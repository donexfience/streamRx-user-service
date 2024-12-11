import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true }) 
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  hashed_password: string;

  @Prop({ unique: true, sparse: true })
  username?: string;

  @Prop()
  phone_number?: string;

  @Prop()
  date_of_birth?: Date;

  @Prop()
  profileImageURL?: string;

  @Prop({ type: String }) 
  social_links?: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ default: false })
  is_verified: boolean;

  @Prop({ default: 'VIEWER' }) 
  role: string;

  @Prop()
  bio?: string;

  @Prop({ unique: true, sparse: true })
  google_id?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);