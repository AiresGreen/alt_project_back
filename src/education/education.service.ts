import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {curriculum_vitae} from "@prisma/client";


@Injectable()
export class EducationService {
  constructor(private prisma: PrismaService,) {}


  async create(body: CreateProjectDto, curriculum_vitae_id: number) {
    const education = await this.prisma.education.findUnique({
      where: {id: body.id},
    });
    if (!education) throw new NotFoundException(`Education avec le titre: ${body.title}`);

    return this.prisma.curriculum_vitae_has_education.upsert({
      where: {
        curriculum_vitae_id_education_id:{
          curriculum_vitae_id: curriculum_vitae_id,
          education_id: education.id
        },
      },
      update: {},
      create: {
        education: {connect: {id: education.id}},
        curriculum_vitae: {connect: {id: curriculum_vitae_id}},
        },
        include: {
        education: {select: {id: true}},
        }
    });
  }

  async findAll() {
    return this.prisma.education.findMany({
      select: {
        id: true,
      }
    });
  }

  findOne(id: number) {
    return this.prisma.education.findUnique({
      where: {id: id},
    });
  }

  async update(id:number, body: UpdateEducationDto) {
    const education = await this.prisma.education.findUnique({
      where: {id: body.id},
    });
    if (!education) throw new NotFoundException(`Education avec le titre: ${body.title}`);

    return this.prisma.education.upsert({
      where: {id: body.id},
      update: {
        ...education,
      },
      create: {
        ...education,
      }
    })
  }



  async remove(id: number) {
    const education = await this.prisma.education.findUnique({
      where: {id: id},
    });
    if (!education) throw new NotFoundException(`Education avec l'id: ${id}`);

    return this.prisma.education.delete({
      where: {id: education.id},
    })
  }
}
