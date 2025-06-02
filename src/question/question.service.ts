import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateQuestionDto} from './dto/create-question.dto';
import {UpdateQuestionDto} from './dto/update-question.dto';
import {PrismaService} from "../../prisma/prisma.service";


@Injectable()
export class QuestionService {
    constructor(
        private prisma: PrismaService,
    ) {
    }


    create(body: CreateQuestionDto, id: number, survey_id: number,) {
        const question = this.prisma.question.findUnique({
            where: {
                id: id,
            }
        });
        if (!question) throw new NotFoundException("Question already exists");

        return this.prisma.survey_has_question.upsert({
            where: {
                survey_id_question_id: {
                    survey_id: survey_id,
                    question_id: body.id,
                },
            },
            update: {},
            create: {
                survey: {connect: {id: survey_id}},
                question: {connect: {id: body.id}},
                ...body,
            },
            include: {
                question: {select: {id: true}},
            }
        });
    }

    findAll() {
        return this.prisma.question.findMany();
    }

    findOne(id: number) {
      const question = this.prisma.question.findUnique({
        where: {
          id: id,
        }
      });
      if (!question) throw new NotFoundException("Question doesn't exist");

      return this.prisma.question.findUnique({
          where: {
            id: id,
          }
        });
    }


    remove(id: number) {
      const question = this.prisma.question.findUnique({
        where: {
          id: id,
        }
      });
      if (!question) throw new NotFoundException("Question doesn't exist");

      return this.prisma.question.delete({
        where: {
          id: id,
        }
      });
    }
}
