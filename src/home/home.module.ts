import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import {PrismaModule} from "../../prisma/prisma.module";
import {HttpModule} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [HomeController],
  providers: [HomeService, ConfigService],
})
export class HomeModule {}
