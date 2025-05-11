import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../prisma/prisma.service";
import {NotFoundError} from "rxjs";


@Injectable()
export class HomeService {
  constructor(
      private prisma: PrismaService,
  ) {
  }


  findAll() {
    return this.prisma.offer.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        publication_date: true,
      },
    })

  }

  findOne(id: number) {
    try {
      return this.prisma.offer.findUnique({
        where: {
          id: id,
        }
      });
    } catch (error) {
      throw new NotFoundException("Offre inexistant)");
    }
  }
}
