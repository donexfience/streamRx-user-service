import { StreamerRequestRepository } from "src/infrastructure/database/mongoose/repositories/streamerRequest.respository";
import { StreamerRequestEntity } from "src/domain/entities/streamerRequestEntity";
import { CreateStreamerRequestDto } from "src/application/dtos/create-request-dto";

export class CreateRequestUseCase {
  constructor(private readonly streamerRequestRepository: StreamerRequestRepository) {}

  async execute(createRequestDto: CreateStreamerRequestDto): Promise<StreamerRequestEntity> {
    const newRequest = new StreamerRequestEntity({
      channelName: createRequestDto.channelName,
      category: createRequestDto.category,
      experience: createRequestDto.experience,
      experiencedPlatforms: createRequestDto.experiencedPlatforms,
      message: createRequestDto.message,
      socialLinks: createRequestDto.socialLinks,
      accessibility: createRequestDto.accessibility,
    });

    return await this.streamerRequestRepository.create(newRequest);
  }
}
