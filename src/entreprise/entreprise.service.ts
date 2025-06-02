import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateEntrepriseDto } from './dto/create-entreprise.dto';
import { UpdateEntrepriseDto } from './dto/update-entreprise.dto';
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class EntrepriseService {
  constructor(
      private prisma: PrismaService,
  ) {}


  findAll() {
    return this.prisma.enterprise.findMany()
  }

  findOne(id: number) {
    const entreprise = this.prisma.enterprise.findUnique({
      where: {
        id: id,
      }
        });
    if (!entreprise) throw new NotFoundException('Entreprise not found')
        return entreprise;
  }




}
