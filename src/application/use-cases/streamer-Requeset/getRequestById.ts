import { StreamerRequestRepository } from 'src/infrastructure/database/mongoose/repositories/streamerRequest.respository';
import { Types } from 'mongoose';
import { StreamerRequestEntity } from 'src/domain/entities/streamerRequestEntity';
import { Injectable } from '@nestjs/common';
@Injectable()
export class GetRequestByIdUseCase {
  constructor(
    private readonly streamerRequestRepository: StreamerRequestRepository,
  ) {}

  async execute(id: string): Promise<StreamerRequestEntity | null> {
    return await this.streamerRequestRepository.findById(id);
  }
}
