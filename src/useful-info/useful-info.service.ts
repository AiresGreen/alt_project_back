import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateUsefulInfoDto } from './dto/create-useful-info.dto';
import { UpdateUsefulInfoDto } from './dto/update-useful-info.dto';
import {PrismaService} from "../../prisma/prisma.service";


@Injectable()
export class UsefulInfoService {
  constructor(private prisma: PrismaService,) {}


  async create(body: CreateUsefulInfoDto, id:number, curriculum_vitae_id: number) {
    const usefulInfo = await this.prisma.useful_information.findUnique({
      where: {id: id},
    });
    if (!usefulInfo) throw new NotFoundException(`Skill avec le titre: ${body.name}`);

    return this.prisma.curriculum_vitae_has_useful_information.upsert({
      where: {
        curriculum_vitae_id_useful_information_id:{
          curriculum_vitae_id: curriculum_vitae_id,
          useful_information_id: usefulInfo.id
        },
      },
      update: {},
      create: {
        useful_information: {connect: {id: usefulInfo.id}},
        curriculum_vitae: {connect: {id: curriculum_vitae_id}},
      },
      include: {
        useful_information: {select: {id: true}},
      }
    });
  }

  async findAll() {
    return this.prisma.useful_information.findMany({
      select: {
        id: true,
      }
    });
  }

  findOne(id: number) {
    return this.prisma.useful_information.findUnique({
      where: {id: id},
    });
  }

  async update(id:number, body: UpdateUsefulInfoDto) {
    const usefulInfo = await this.prisma.useful_information.findUnique({
      where: {id: id},
    });
    if (!usefulInfo) throw new NotFoundException(`Skill avec le titre: ${body.name}`);

    return this.prisma.useful_information.upsert({
      where: {id: id},
      update: {
        ...usefulInfo,
      },
      create: {
        ...usefulInfo,
      }
    })
  }



  async remove(id: number) {
    const usefulInfo = await this.prisma.useful_information.findUnique({
      where: {id: id},
    });
    if (!usefulInfo) throw new NotFoundException(`Skill avec l'id: ${id}`);

    return this.prisma.useful_information.delete({
      where: {id: usefulInfo.id},
    })
  }
}

