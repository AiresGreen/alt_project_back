import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {PrismaService} from "../../prisma/prisma.service";



@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService,) {}


  async create(body: CreateProjectDto, id:number, curriculum_vitae_id: number) {
    const project = await this.prisma.project.findUnique({
      where: {id: id},
    });
    if (!project) throw new NotFoundException(`Project avec le titre: ${body.name}`);

    return this.prisma.curriculum_vitae_has_project.upsert({
      where: {
        curriculum_vitae_id_project_id:{
          curriculum_vitae_id: curriculum_vitae_id,
          project_id: project.id
        },
      },
      update: {},
      create: {
        project: {connect: {id: project.id}},
        curriculum_vitae: {connect: {id: curriculum_vitae_id}},
      },
      include: {
        project: {select: {id: true}},
      }
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      select: {
        id: true,
      }
    });
  }

  findOne(id: number) {
    return this.prisma.project.findUnique({
      where: {id: id},
    });
  }

  async update(id:number, body: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: {id: id},
    });
    if (!project) throw new NotFoundException(`Project avec le titre: ${body.name}`);

    return this.prisma.project.upsert({
      where: {id: id},
      update: {
        ...project,
      },
      create: {
        ...project,
      }
    })
  }



  async remove(id: number) {
    const project = await this.prisma.project.findUnique({
      where: {id: id},
    });
    if (!project) throw new NotFoundException(`Project avec l'id: ${id}`);

    return this.prisma.project.delete({
      where: {id: project.id},
    })
  }
}

