import { StreamerRequestStatus } from 'src/infrastructure/database/mongoose/schemas/streamerRequsetSchema';
export class UpdateStreamerRequestDto {
  status: StreamerRequestStatus;
}
