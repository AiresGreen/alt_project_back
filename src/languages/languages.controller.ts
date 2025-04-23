import {Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {Public} from "../auth/decorator/public.decorator";


@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService,
              private prisma: PrismaService,) {
  }

  @Public()
  @Get()
  findAll() {
    return this.languagesService.findAll();
  }

  @Public()
  @Post()
  async create(@Body() body: CreateLanguageDto) {
    return this.languagesService.createLanguage(body)
  }

  @Public()
  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: UpdateLanguageDto) {
    return this.languagesService.updateLanguage(+id, body)
  }
}
