import {Controller, Get, Post, Body, Req, Put, Param, Query, BadRequestException, ParseIntPipe, Patch, Delete} from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';

import {PrismaService} from "../../prisma/prisma.service";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {language_level_of_language} from "@prisma/client";


@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService,
              private prisma: PrismaService,
              private readonly httpService: HttpService,
              private configService: ConfigService,) {
  }

  // 1) GET /languages/all
  @Get('all')
  findAll() {
    return this.languagesService.findAll();
  }

  // 2) GET /languages/levels
  @Get('levels')
  getLevels() {
    // On renvoie simplement les valeurs de l’enum Prisma
    return Object.values(language_level_of_language);
  }

  // 3) GET /languages/:user_id
  @Get(':user_id')
  getUserLanguages(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.languagesService.findLanguagesForUser(user_id);
  }

  // 4) POST /languages   (upsert create/update)
  @Post()
  async upsert(
      @Body() dto: CreateLanguageDto,
      @Req() req: any,
  ) {
    const user_id = req.user?.id;
    if (!user_id) {
      throw new BadRequestException('Utilisateur non authentifié');
    }
    return this.languagesService.upsert(dto, user_id);
  }

  // 5) PUT /languages/:id  (modification)
  @Put(':id')
  async update(
      @Param('id') id: string,
      @Body() dto: CreateLanguageDto,
      @Req() req: any,
  ) {
    const user_id = req.user?.id;
    if (!user_id) {
      throw new BadRequestException('Utilisateur non authentifié');
    }
    // On réutilise la même logique d’upsert, mais on peut
    // vérifier que l’enregistrement existe déjà si besoin
    return this.languagesService.upsert(dto, user_id);
  }

  // 6) DELETE /languages/:id  (suppression)
  @Delete(':id')
  async remove(
      @Param('id') id: number,
      @Req() req: any,
  ) {
    const user_id = req.user?.id;
    if (!user_id) {
      throw new BadRequestException('Utilisateur non authentifié');
    }

    // On supprime la ligne dans user_has_language
    return this.prisma.user_has_language.delete({
      where: {
        user_id_language_id: {
          user_id,
          language_id: id,
        },
      },
    });
  }
}