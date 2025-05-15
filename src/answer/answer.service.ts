import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import {PrismaService} from "../../prisma/prisma.service";


@Injectable()
export class AnswerService {
  constructor(
      private prisma: PrismaService,
  ) {
  }

  findAll() {
    return this.prisma.answer.findMany({
      select: {
        id: true,
      }
    });
  }

  findOne(id: number) {
    const answer = this.prisma.answer.findUnique({
      where: {
        id: id,
      }
    });
    if (!answer) throw new NotFoundException("answer doesn't exist");

    return this.prisma.answer.findUnique({
      where: {
        id: id,
      }
    });
  }



}
