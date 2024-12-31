import { Types } from 'mongoose';
import { StreamerRequestStatus } from 'src/infrastructure/database/mongoose/schemas/streamerRequsetSchema';

export class StreamerRequestEntity {
  id: Types.ObjectId; 
  channelName: string;
  category: string[]; 
  experience: string;
  experiencedPlatforms: string[]; 
  message: string; 
  socialLinks: Record<string, string>; 
  accessibility: string;
  status: StreamerRequestStatus;
  createdAt: Date; 
  updatedAt: Date; 
  constructor(init: Partial<StreamerRequestEntity>) {
    this.id = init.id || new Types.ObjectId();
    this.channelName = init.channelName || '';
    this.category = init.category || [];
    this.experience = init.experience || '';
    this.experiencedPlatforms = init.experiencedPlatforms || [];
    this.message = init.message || '';
    this.socialLinks = init.socialLinks || { twitter: '', instagram: '', youtube: '' };
    this.accessibility = init.accessibility || '';
    this.status = init.status || StreamerRequestStatus.PENDING;
    this.createdAt = init.createdAt || new Date();
    this.updatedAt = init.updatedAt || new Date();
  }
}
