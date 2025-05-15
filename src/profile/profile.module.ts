import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import {PrismaModule} from "../../prisma/prisma.module";
import {HttpModule} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [ProfileController, ConfigService],
  providers: [ProfileService],
  exports: [ProfileService, ConfigService],
})
export class ProfileModule {}
