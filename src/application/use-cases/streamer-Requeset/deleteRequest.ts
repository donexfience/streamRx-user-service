import { StreamerRequestRepository } from "src/infrastructure/database/mongoose/repositories/streamerRequest.respository";
import { Types } from "mongoose";
import { StreamerRequestEntity } from "src/domain/entities/streamerRequestEntity";

export class DeleteRequestUseCase {
  constructor(private readonly streamerRequestRepository: StreamerRequestRepository) {}

  async execute(id: Types.ObjectId): Promise<StreamerRequestEntity | null> {
    return await this.streamerRequestRepository.delete(id);
  }
}
