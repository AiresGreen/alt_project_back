import {Injectable, InternalServerErrorException} from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {language} from "@prisma/client";


@Injectable()
export class LanguagesService {
    constructor(
        private prisma: PrismaService,
    ) {
    }

    findAll() {
        return this.prisma.language.findMany({
            select: {
                id: true,
                name: true,
            }
        })
    }

    // async upsert(dto: CreateLanguageDto,user_id:number) {
    //     const language = await this.prisma.language.upsert({
    //         where: { name: dto.name },
    //         update: {}, 
    //         create: { name: dto.name },
    //       });
    //     return this.prisma.user_has_language.upsert({
    //         where: {
    //             user_id_language_id: {
    //               user_id: user_id,
    //               language_id: language.id,
    //             },
    //           },
    //           update: {
    //             level: dto.level,
    //           },
    //           create: {
    //             user: { connect: { id: user_id } },
    //             language: { connect: { id: language.id } },
    //             level: dto.level,
    //           },
    //           include: {
    //             language: { select: { name: true } },
    //           },
    //         });


    // }

    async create(dto: CreateLanguageDto, user_id: number) {
        return this.prisma.user_has_language.create({
          data: {
            user: { connect: { id: user_id } },
            language: {
              connectOrCreate: {
                where: { name: dto.name },
                create: {
                    name: dto.name,
                    },
              },
            },
              level: dto.level,
          },
          include: {
            language: { select: { name: true } },
          },
        });
      }


    async update(id: number, dto: UpdateLanguageDto) {

            return await this.prisma.language.update({
                where: {id},
                data: {
                    ...dto,
                },
            });

    }
}
