import { Module } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { LanguagesController } from './languages.controller';
import {PrismaModule} from "../../prisma/prisma.module";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [LanguagesController],
  providers: [LanguagesService],
  exports: [LanguagesService],
})
export class LanguagesModule {}
