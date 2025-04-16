import { Module } from '@nestjs/common';
import { ProfilePictureService } from './profile-picture.service';
import { ProfilePictureController } from './profile-picture.controller';

@Module({
  controllers: [ProfilePictureController],
  providers: [ProfilePictureService],
})
export class ProfilePictureModule {}
