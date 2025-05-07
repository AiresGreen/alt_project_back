import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class ProfileService {
  constructor(
      private readonly profileService: ProfileService,
      private prisma: PrismaService,
  ) {}

  findAll () {
    return this.prisma.profil.findMany({
          select: {
            id: true,
            phone_number: true,
          }
        }
    );
  }

  async upsert (dto: CreateProfileDto, user_id: number) {

  }



}
