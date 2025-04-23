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
                level: true,
            }
        })
    }

    async createLanguage(dto: CreateLanguageDto) {
        try {
            return await this.prisma.language.upsert({
                where: {name: dto.name},
                create: {
                    name: dto.name,
                    level: dto.level,
                },
                update: {
                    ...dto
                },
            });
        } catch (error) {
            throw new InternalServerErrorException("Language already exists")
        }
    }

    async updateLanguage(id: number, dto: UpdateLanguageDto) {
        try {
            return await this.prisma.language.update({
                where: {id},
                data: {
                    ...dto,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException("Language does not exist")
        }
    }
}
