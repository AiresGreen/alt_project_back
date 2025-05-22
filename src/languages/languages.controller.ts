import {Controller, Get, Post, Body, Req} from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';

import {PrismaService} from "../../prisma/prisma.service";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";


@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService,
              private prisma: PrismaService,
              private readonly httpService: HttpService,
              private configService: ConfigService,) {
  }


  @Get()
  findAll() {
    return this.languagesService.findAll();
  }

  @Post()
  async upsert(@Body() dto: CreateLanguageDto,
               @Req() req:any) {
    const user_id = req.user.id;
  return this.languagesService.upsert(dto,user_id)
  }


}
