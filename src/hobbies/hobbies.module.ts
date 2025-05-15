import { Module } from '@nestjs/common';
import { HobbiesService } from './hobbies.service';
import { HobbiesController } from './hobbies.controller';
import {PrismaModule} from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [HobbiesController],
  providers: [HobbiesService],
  exports: [HobbiesService],
})
export class HobbiesModule {}
