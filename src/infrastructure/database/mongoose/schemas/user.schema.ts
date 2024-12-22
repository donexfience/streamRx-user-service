import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema()
class SocialLink {
  @Prop({ required: true })
  platform: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  id: string;
}

const SocialLinkSchema = SchemaFactory.createForClass(SocialLink);

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

  @Prop({ type: [SocialLinkSchema], default: [] })
  social_links?: SocialLink[];

  @Prop({ default: 'VIEWER' })
  role: string;

  @Prop()
  bio?: string;
  
  @Prop({ type: [String], default: [] })
  tags?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
