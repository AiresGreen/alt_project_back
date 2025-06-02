import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import {PrismaService} from "../../prisma/prisma.service";


@Injectable()
export class CvService {
  constructor(private prisma: PrismaService,) {}


  async create(body: CreateCvDto) {
    const cv = await this.prisma.curriculum_vitae.findUnique({
      where: {phone_number: body.phone_number},
    });
    if (!cv) throw new NotFoundException(`Cv avec le tél: ${body.phone_number}`);

    return this.prisma.curriculum_vitae.upsert({
      where: {
        phone_number:body.phone_number
      },
      update: {
        ...body,
      },
      create: {
        ...cv,
      },
    });
  }

  async findAll() {
    return this.prisma.curriculum_vitae.findMany({
      select: {
        id: true,
        phone_number: true,
        firstname: true,
        lastname: true,
        mail: true,
        photo: true,
        street: true,
        zip_code: true,
        city: true,

      }
    });
  }

  findOne(phone_number: string) {
    return this.prisma.curriculum_vitae.findUnique({
      where: {phone_number: phone_number},
    });
  }

findByUserId(user_id: number) {
    return this.prisma.curriculum_vitae.findMany({
      where: {
        user_id: user_id,
      }
    })
}

  async update(body: UpdateCvDto, phone_number:string) {
    const cv = await this.prisma.curriculum_vitae.findUnique({
      where: {phone_number: phone_number},
    });
    if (!cv) throw new NotFoundException(`Skill avec le titre: ${phone_number}`);

    return this.prisma.curriculum_vitae.upsert({
      where: {phone_number: phone_number},
      update: {
        ...body,
      },
      create: {
        ...cv,
      }
    })
  }



  async remove(phone_number: string) {
    const cv = await this.prisma.curriculum_vitae.findUnique({
      where: {phone_number: phone_number},
    });
    if (!cv) throw new NotFoundException(`Cv avec le tél: ${phone_number}`);

    return this.prisma.curriculum_vitae.delete({
      where: {phone_number: phone_number},
    })
  }
}

