import { Types } from 'mongoose';
import {
  StreamerRequestDocument,
  StreamerRequestStatus,
} from '../schemas/streamerRequsetSchema';
import { StreamerRequestEntity } from 'src/domain/entities/streamerRequestEntity';

export interface IStreamerRequestRepository {
  create(
    createRequestDto: StreamerRequestEntity,
  ): Promise<StreamerRequestEntity>;
  findById(id: string): Promise<StreamerRequestEntity>;
  findAll(): Promise<StreamerRequestEntity[]>;
  findByStatus(status: StreamerRequestStatus): Promise<StreamerRequestEntity[]>;
  updateStatus(
    id: string,
    status: StreamerRequestStatus,
  ): Promise<StreamerRequestEntity>;
  delete(id: Types.ObjectId): Promise<StreamerRequestEntity>;
  findByUserId(userId: Types.ObjectId): Promise<StreamerRequestEntity[]>;
}
