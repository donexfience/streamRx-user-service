export class CreateStreamerRequestDto {
    channelName: string;
    category: string;
    experience: string;
    experiencedPlatforms: string[];
    message: string;
    socialLinks: Record<string, string>;
    accessibility: string;
  }
  