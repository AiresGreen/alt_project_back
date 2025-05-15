import { Module } from '@nestjs/common';
import { EntrepriseService } from './entreprise.service';
import { EntrepriseController } from './entreprise.controller';
import {PrismaModule} from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [EntrepriseController],
  providers: [EntrepriseService],
  exports: [EntrepriseService],
})
export class EntrepriseModule {}
