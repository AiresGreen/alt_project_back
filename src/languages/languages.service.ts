import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {HttpService} from "@nestjs/axios";






@Injectable()
export class LanguagesService {
    constructor(
        private prisma: PrismaService,
        private readonly httpService: HttpService,
    ) {
    }

    findAll() {
        return this.prisma.language.findMany({
            select: {
                id: true,
                langEnglishName: true,
            }
        })
    }

    async upsert(dto: CreateLanguageDto,user_id:number) {
         const language = await this.prisma.language.findUnique({
             where: { langEnglishName: dto.langEnglishName },
                    });
        if (!language) {
            throw new NotFoundException(`Language with id ${dto.langEnglishName} not found`);;
        }

        console.log(language.id, language.langEnglishName);


        return this.prisma.user_has_language.upsert({
             where: {
                 user_id_language_id: {
                   user_id: user_id,
                   language_id: language.id,
                 },
               },
               update: {
                 level: dto.level,
               },
               create: {
                 user: { connect: { id: user_id } },
                 language: { connect: { id: language.id } },
                 level: dto.level,
               },
               include: {
                 language: { select: { langEnglishName: true } },
               },
             });
    }

}
