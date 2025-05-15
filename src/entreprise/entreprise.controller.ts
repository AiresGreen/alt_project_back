import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntrepriseService } from './entreprise.service';
import { CreateEntrepriseDto } from './dto/create-entreprise.dto';
import { UpdateEntrepriseDto } from './dto/update-entreprise.dto';

@Controller('entreprise')
export class EntrepriseController {
  constructor(private readonly entrepriseService: EntrepriseService) {}

  @Get()
  findAll() {
    return this.entrepriseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entrepriseService.findOne(+id);
  }


}
