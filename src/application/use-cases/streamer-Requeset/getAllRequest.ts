import { StreamerRequestRepository } from 'src/infrastructure/database/mongoose/repositories/streamerRequest.respository';
import { Types } from 'mongoose';
import { StreamerRequestEntity } from 'src/domain/entities/streamerRequestEntity';
import { Injectable } from '@nestjs/common';
@Injectable()
export class GetAllRequest {
  constructor(
    private readonly streamerRequestRepository: StreamerRequestRepository,
  ) {
    console.log(
      'GetAllRequest: Repository injected:',
      !!streamerRequestRepository,
    );
  }

  async execute(): Promise<StreamerRequestEntity[]> {
    try {
      console.log('GetAllRequest: Executing findAll');
      const results = await this.streamerRequestRepository.findAll();
      console.log('GetAllRequest: Got results:', results?.length ?? 0);
      return results;
    } catch (error) {
      console.error('GetAllRequest: Error executing findAll:', error);
      throw error;
    }
  }
}
