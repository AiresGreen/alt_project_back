import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {UpdateEducationDto} from "../education/dto/update-education.dto";

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService,) {}


  async create(body: CreateSkillDto, id:number, curriculum_vitae_id: number) {
    const skill = await this.prisma.skill.findUnique({
      where: {id: id},
    });
    if (!skill) throw new NotFoundException(`Skill avec le titre: ${body.name}`);

    return this.prisma.curriculum_vitae_has_skill.upsert({
      where: {
        curriculum_vitae_id_skill_id:{
          curriculum_vitae_id: curriculum_vitae_id,
          skill_id: skill.id
        },
      },
      update: {},
      create: {
        skill: {connect: {id: skill.id}},
        curriculum_vitae: {connect: {id: curriculum_vitae_id}},
      },
      include: {
        skill: {select: {id: true}},
      }
    });
  }

  async findAll() {
    return this.prisma.skill.findMany();
  }

  findOne(id: number) {
    return this.prisma.skill.findUnique({
      where: {id: id},
    });
  }

  findByUserId(user_id: number) {
    return this.prisma.skill.findMany({
      where: {user_id: user_id},
    })
  }



  async update(id:number, body: UpdateSkillDto) {
    const skill = await this.prisma.skill.findUnique({
      where: {id: id},
    });
    if (!skill) throw new NotFoundException(`Skill avec le titre: ${body.name}`);

    return this.prisma.skill.upsert({
      where: {id: id},
      update: {
        ...skill,
      },
      create: {
        ...skill,
      }
    })
  }



  async remove(id: number) {
    const skill = await this.prisma.skill.findUnique({
      where: {id: id},
    });
    if (!skill) throw new NotFoundException(`Skill avec l'id: ${id}`);

    return this.prisma.skill.delete({
      where: {id: skill.id},
    })
  }
}
