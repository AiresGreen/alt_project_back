import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {curriculum_vitae} from "@prisma/client";
import {UpdateEducationDto} from "../education/dto/update-education.dto";

@Injectable()
export class ExperienceService {
  constructor(
      private prisma: PrismaService,
  ) {}



  async create(body: CreateExperienceDto, curriculum_vitae_id: number) {
    const experience = await this.prisma.experience.findUnique({
      where: {id: body.id},
    });
    if (!experience) throw new NotFoundException('experience not found');

    return this.prisma.curriculum_vitae_has_experience.upsert({
          where: {
            curriculum_vitae_id_experience_id:
                {
                  curriculum_vitae_id: curriculum_vitae_id,
                  experience_id: experience.id,
                }
          },
          update: {},
          create: {
            curriculum_vitae: {connect: {id: curriculum_vitae_id}},
            experience: {connect: {id: experience.id}},
          },
        include: {
              experience: {select: {id: true}},
        },

        }
    )

  }

  async findAll() {
    return this.prisma.experience.findMany();
  }

    findOne(id: number) {
        return this.prisma.experience.findUnique({
            where: {id: id},
        });
    }

    findByUserId(user_id: number) {
        return this.prisma.experience.findMany({
            where: {user_id: user_id},
        })
    }


    async update(id: number, body: UpdateExperienceDto, ) {
        const experience = await this.prisma.experience.findUnique({
            where: {id: body.id},
        });
        if (!experience) throw new NotFoundException(`Experience avec l'id: ${body.id}`);

        return this.prisma.experience.upsert({
            where: {id: body.id},
            update: {
                ...experience,
            },
            create: {
                ...experience,
            }
        })
    }



    async remove(id: number) {
        const experience = await this.prisma.experience.findUnique({
            where: {id: id},
        });
        if (!experience) throw new NotFoundException(`Experience avec l'id: ${id}`);

        return this.prisma.experience.delete({
            where: {id: experience.id},
        })
    }
}
