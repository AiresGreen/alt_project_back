import { Controller, Get,Param } from '@nestjs/common';
import { HomeService } from './home.service';
import {PrismaService} from "../../prisma/prisma.service";

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService,
              private prisma: PrismaService,) {}


  @Get()
  findAll() {
    return this.homeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeService.findOne(+id);
  }

}
