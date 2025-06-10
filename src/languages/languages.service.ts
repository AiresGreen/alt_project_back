import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {HttpService} from "@nestjs/axios";
import {language_level_of_language} from "@prisma/client";



@Injectable()
export class LanguagesService {
    constructor(
        private prisma: PrismaService,
        private readonly httpService: HttpService,
    ) {
    }
    
     //== Récupère la liste de toutes les langues (pour l'autocomplete dans le front)
     
    findAll() {
        return this.prisma.language.findMany();
    }


     //==Récupère les langues + niveaux enregistrés pour un user donné

    async findLanguagesForUser(user_id: number) {
        return await this.prisma.user_has_language.findMany(
            {
                where: {
                    user_id: user_id,
                },
                select: {
                    language_id: true,
                    level: true,
                    language: {
                        select: {
                            id: true,
                            langEnglishName: true,
                        }
                    }
                }
            }
        )

    }


     //==Upsert (create ou update) du couple (user_id, language_id) avec un level

    async upsert(dto: CreateLanguageDto, user_id: number) {

        const language = await this.prisma.language.findUnique({
            where: { langEnglishName: dto.langEnglishName },
        });
        if (!language) {
            throw new NotFoundException(
                `Language "${dto.langEnglishName}" introuvable.`,
            );
        }


        try {
            return await this.prisma.user_has_language.upsert({
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
                    level: dto.level as language_level_of_language,
                },
                include: {
                    language: {
                        select: {
                            id: true,
                            langEnglishName: true,
                        },
                    },
                },
            });
        } catch (error) {
            console.error('🔥 Erreur Prisma Upsert:', error);
            throw new InternalServerErrorException(
                'Échec de l’enregistrement de la langue pour l’utilisateur.',
            );
        }
    }


    async remove(user_id: number, language_id: number) {
        const languageOfUser = await this.prisma.user_has_language.findUnique({
            where: {
                user_id_language_id: { user_id, language_id },
            },
        });
        if (!languageOfUser) {
            throw new NotFoundException('Langue ou user non trouvé');
        }
        return this.prisma.user_has_language.delete({
            where: {
                user_id_language_id: { user_id, language_id },
            },
            });
    }
}