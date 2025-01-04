import { StreamerRequestRepository } from "src/infrastructure/database/mongoose/repositories/streamerRequest.respository";
import { StreamerRequestEntity } from "src/domain/entities/streamerRequestEntity";
import { Types } from "mongoose";
import { UpdateStreamerRequestDto } from "src/application/dtos/update-request-dto";
import { Injectable } from "@nestjs/common";
@Injectable()
export class UpdateRequestStatusUseCase {
  constructor(private readonly streamerRequestRepository: StreamerRequestRepository) {}

  async execute(
    id: string,
    updateRequestDto: UpdateStreamerRequestDto
  ): Promise<StreamerRequestEntity | null> {
    console.log(updateRequestDto, 'in the use case');
    const existingRequest = await this.streamerRequestRepository.findById(id);
    if (!existingRequest) return null;
    const updatedEntity = new StreamerRequestEntity({
      ...existingRequest,
      status: updateRequestDto.status,
    });
    return await this.streamerRequestRepository.updateStatus(id, updatedEntity.status);
  }
}
