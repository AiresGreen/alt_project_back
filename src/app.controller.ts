import {
  Controller, Post, Req, UseGuards,
} from '@nestjs/common'
import {PrismaService} from "../prisma/prisma.service";



@Controller()
export class AppController {
  constructor(
      private readonly prismaService: PrismaService,) {}


}