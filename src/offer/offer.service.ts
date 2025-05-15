import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class OfferService {
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