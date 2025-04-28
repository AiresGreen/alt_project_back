import {Controller, Get, Post, Body, Patch, Param, Delete, Put, Req} from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {Public} from "../auth/decorator/public.decorator";
import { RequestWithUser } from 'src/auth/auth.controller';


@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService,
              private prisma: PrismaService,) {
  }


  @Get()
  findAll() {
    return this.languagesService.findAll();
  }


  @Post()
  async create(@Body() body: CreateLanguageDto,@Req()req:RequestWithUser) {
    console.log(req.user)
    return this.languagesService.create(body,req.user.id)
  }

  @Public()
  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: UpdateLanguageDto) {
    return this.languagesService.update(+id, body)
  }
}
