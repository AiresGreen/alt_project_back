import { Module } from '@nestjs/common';
import { UsefulInfoService } from './useful-info.service';
import { UsefulInfoController } from './useful-info.controller';
import {PrismaModule} from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [UsefulInfoController],
  providers: [UsefulInfoService],
  exports: [UsefulInfoService],
})
export class UsefulInfoModule {}
