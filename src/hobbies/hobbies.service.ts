import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto } from './dto/update-hobby.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {UpdateEducationDto} from "../education/dto/update-education.dto";

@Injectable()
export class HobbiesService {
  constructor(private prisma: PrismaService,) {}


  async create(body: CreateHobbyDto, id:number, curriculum_vitae_id: number) {
    const hobby = await this.prisma.hobby.findUnique({
      where: {id: id},
    });
    if (!hobby) throw new NotFoundException(`Hobby avec le titre: ${body.name}`);

    return this.prisma.curriculum_vitae_has_hobby.upsert({
      where: {
        curriculum_vitae_id_hobby_id:{
          curriculum_vitae_id: curriculum_vitae_id,
          hobby_id: hobby.id
        },
      },
      update: {},
      create: {
        hobby: {connect: {id: hobby.id}},
        curriculum_vitae: {connect: {id: curriculum_vitae_id}},
      },
      include: {
        hobby: {select: {id: true}},
      }
    });
  }

  async findAll() {
    return this.prisma.hobby.findMany();
  }

  findOne(id: number) {
    return this.prisma.hobby.findUnique({
      where: {id: id},
    });
  }

  findByUserId(user_id: number) {
    return this.prisma.hobby.findMany({
      where: {user_id: user_id},
    })
  }


  async update(id:number, body: UpdateHobbyDto) {
    const hobby = await this.prisma.hobby.findUnique({
      where: {id: id},
    });
    if (!hobby) throw new NotFoundException(`Education avec le titre: ${body.name}`);

    return this.prisma.hobby.upsert({
      where: {id: id},
      update: {
        ...hobby,
      },
      create: {
        ...hobby,
      }
    })
  }



  async remove(id: number) {
    const hobby = await this.prisma.hobby.findUnique({
      where: {id: id},
    });
    if (!hobby) throw new NotFoundException(`Education avec l'id: ${id}`);

    return this.prisma.education.delete({
      where: {id: hobby.id},
    })
  }
}

