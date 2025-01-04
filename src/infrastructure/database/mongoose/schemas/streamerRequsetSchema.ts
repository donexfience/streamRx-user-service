import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StreamerRequestDocument = HydratedDocument<StreamerRequeset> & {
  createdAt: Date;
  updatedAt: Date;
};

export enum StreamerRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class StreamerRequeset {


  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  channelName: string;

  @Prop({ required: true })
  category: string[];

  @Prop({ required: true })
  experience: string;

  @Prop({ type: [String], default: [] })
  experiencedPlatforms: string[];

  @Prop({ required: true })
  message: string;

  @Prop({
    type: Map,
    of: String,
    default: {
      twitter: '',
      instagram: '',
      youtube: '',
    },
  })
  socialLinks: Record<string, string>;

  @Prop({ required: true })
  accessibility: string;

  @Prop({     
    type: String,
    enum: StreamerRequestStatus,
    default: StreamerRequestStatus.PENDING,
  })
  status: StreamerRequeset;
}

export const StreamerRequestSchema =
  SchemaFactory.createForClass(StreamerRequeset);
