import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class FavoriteService {
  constructor(
      private prisma: PrismaService,
  ) {
  }


  findAll() {
    return this.prisma.favorite.findMany({
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

  remove(id: number) {
  }
}
