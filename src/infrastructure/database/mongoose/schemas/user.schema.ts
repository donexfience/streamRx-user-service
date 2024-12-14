import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SocialLink } from 'src/domain/interfaces/user.interface';

export type UserDocument = HydratedDocument<User> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ unique: true, sparse: true })
  username?: string;

  @Prop()
  phone_number?: string;

  @Prop()
  date_of_birth?: string;

  @Prop()
  profileImageURL?: string;

  @Prop({ type: [String], default: [] })
  social_links?: SocialLink[];

  @Prop({ default: 'VIEWER' })
  role: string;

  @Prop()
  bio?: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
