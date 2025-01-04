import { IsEnum, IsNotEmpty } from 'class-validator';
import { StreamerRequestStatus } from 'src/infrastructure/database/mongoose/schemas/streamerRequsetSchema';
export class UpdateStreamerRequestDto {
  @IsNotEmpty()
  @IsEnum(StreamerRequestStatus)
  status: StreamerRequestStatus;
}
