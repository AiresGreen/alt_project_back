import { Module } from '@nestjs/common';
import { HobbiesService } from './hobbies.service';
import { HobbiesController } from './hobbies.controller';

@Module({
  controllers: [HobbiesController],
  providers: [HobbiesService],
})
export class HobbiesModule {}
