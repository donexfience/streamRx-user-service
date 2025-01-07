import { StreamerRequestRepository } from 'src/infrastructure/database/mongoose/repositories/streamerRequest.respository';
import { StreamerRequestEntity } from 'src/domain/entities/streamerRequestEntity';
import {
  CreateStreamerRequestDto,
  SocialLinksDto,
} from 'src/application/dtos/create-request-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateRequestUseCase {
  constructor(
    private readonly streamerRequestRepository: StreamerRequestRepository,
  ) {}

  async execute(
    createRequestDto: CreateStreamerRequestDto,
  ): Promise<StreamerRequestEntity> {
    const socialLinks = this.mapSocialLinks(createRequestDto.socialLinks);
    const newRequest = new StreamerRequestEntity({
      channelName: createRequestDto.channelName,
      category: createRequestDto.category,
      experience: createRequestDto.experience,
      message: createRequestDto.message,
      socialLinks: socialLinks,
      accessibility: createRequestDto.accessibility,
      email: createRequestDto.email,
    });
    console.log('in the use case after convertion to entity ', newRequest);
    const existing = await this.streamerRequestRepository.findBYEmail(
      createRequestDto.email,
    );
    if (existing) {
      throw new Error('request already submitted');
    }

    return await this.streamerRequestRepository.create(newRequest);
  }

  private mapSocialLinks(
    socialLinksDto: SocialLinksDto,
  ): Record<string, string> {
    if (!socialLinksDto) {
      return {};
    }

    return {
      ...(socialLinksDto.twitter ? { twitter: socialLinksDto.twitter } : {}),
      ...(socialLinksDto.instagram
        ? { instagram: socialLinksDto.instagram }
        : {}),
      ...(socialLinksDto.youtube ? { youtube: socialLinksDto.youtube } : {}),
    };
  }
}
