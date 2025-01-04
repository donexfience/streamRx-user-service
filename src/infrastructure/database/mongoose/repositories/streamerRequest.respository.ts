import { InjectModel } from '@nestjs/mongoose';
import { IStreamerRequestRepository } from '../interfaces/streamer-request-repository.interface';
import {
  StreamerRequeset,
  StreamerRequestDocument,
  StreamerRequestStatus,
} from '../schemas/streamerRequsetSchema';
import { Model, Types } from 'mongoose';
import { StreamerRequestEntity } from 'src/domain/entities/streamerRequestEntity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StreamerRequestRepository implements IStreamerRequestRepository {
  constructor(
    @InjectModel(StreamerRequeset.name)
    private readonly streamerRequestModel: Model<StreamerRequestDocument>,
  ) {}

  async create(
    createRequestDto: StreamerRequestEntity,
  ): Promise<StreamerRequestEntity> {
    console.log(createRequestDto, 'in the repository before creating');
    const createStreamerRequest = new this.streamerRequestModel(
      createRequestDto,
    );
    const savedRequest = await createStreamerRequest.save();
    return this.toEntity(savedRequest);
  }

  async findById(id: string): Promise<StreamerRequestEntity> {
    try {
      console.log('StreamerRequestRepository: Finding by id:', id);
      const request = await this.streamerRequestModel.findById(id).exec();
      console.log('StreamerRequestRepository: Found request:', !!request);
      if (!request) return null;
      return this.toEntity(request);
    } catch (error) {
      console.error('StreamerRequestRepository: Error in findById:', error);
      throw error;
    }
  }
  async findAll(): Promise<StreamerRequestEntity[]> {
    try {
      console.log('Repository: Attempting to find all requests');
      const requests = await this.streamerRequestModel.find().exec();
      console.log(`Repository: Found ${requests.length} requests`);
      return requests.map((request) => this.toEntity(request));
    } catch (error) {
      console.error('Repository: Error in findAll:', error);
      throw error;
    }
  }

  async findByStatus(status: string): Promise<StreamerRequestEntity[]> {
    const requests = await this.streamerRequestModel.find({ status }).exec();
    return requests.map(this.toEntity);
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<StreamerRequestEntity> {
    console.log('Repository: Updating status:', id, status);
    const updatedRequest = await this.streamerRequestModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!updatedRequest) return null;
    return this.toEntity(updatedRequest);
  }

  async delete(id: Types.ObjectId): Promise<StreamerRequestEntity> {
    const deletedRequest = await this.streamerRequestModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedRequest) return null;
    return this.toEntity(deletedRequest);
  }

  async findByUserId(userId: Types.ObjectId): Promise<StreamerRequestEntity[]> {
    const requests = await this.streamerRequestModel.find({ userId }).exec();
    return requests.map(this.toEntity);
  }

  private toEntity(document: StreamerRequestDocument): StreamerRequestEntity {
    return new StreamerRequestEntity({
      id: document._id,
      channelName: document.channelName,
      category: document.category,
      experience: document.experience,
      experiencedPlatforms: document.experiencedPlatforms,
      message: document.message,
      socialLinks: document.socialLinks,
      accessibility: document.accessibility,
      status: document.status as unknown as StreamerRequestStatus,
      createdAt: document.createdAt || new Date(),
      updatedAt: document.updatedAt || new Date(),
      email: document.email,
    });
  }
}
