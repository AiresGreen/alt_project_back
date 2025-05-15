import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import {PrismaService} from "../../prisma/prisma.service";


@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService,) {}


  async create(body: CreateApplicationDto) {
    const application = await this.prisma.application.findUnique({
      where: {id: body.id},
    });
    if (!application) throw new NotFoundException(`Application avec l'id: ${body.id}`);

    return this.prisma.application.upsert({
      where: {
          id: application.id

      },
      update: {
        ...application,
      },
      create: {
        ...application,
      },
    });
  }

  async findAll() {
    return this.prisma.application.findMany({
      select: {
        id: true,
      }
    });
  }

  findOne(id: number) {
    return this.prisma.application.findUnique({
      where: {id: id},
    });
  }



  async remove(id: number) {
    const application = await this.prisma.application.findUnique({
      where: {id: id},
    });
    if (!application) throw new NotFoundException(`Application avec l'id: ${id}`);

    return this.prisma.application.delete({
      where: {id: application.id},
    })
  }
}