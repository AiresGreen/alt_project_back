import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class SurveyService {
  constructor(private prisma: PrismaService,) {}


  create(body: CreateSurveyDto, id:number) {
    return this.prisma.survey.upsert({
      where: {
        id: id,
      },
      update: {
        ...body,
      },
      create: {
        ...body,
      }
    });
  }

  findAll() {
    return this.prisma.survey.findMany();
  }

  findOne(id: number) {
    return this.prisma.survey.findUnique({
      where: {
        id: id,
      }
    });
  }


  remove(id: number) {
    const survey = this.prisma.survey.findUnique({
      where: {
        id: id,
      }
    });
    if (!survey) throw new NotFoundException("No such survey");

    return this.prisma.survey.delete({
      where: {
        id: id,
      }
    });
  }
}
