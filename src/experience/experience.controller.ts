import {Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  create(@Body() createExperienceDto: CreateExperienceDto, curriculum_vitae_id: number) {
    return this.experienceService.create(createExperienceDto, curriculum_vitae_id);
  }

  @Get()
  findAll() {
    return this.experienceService.findAll();
  }

  @Get('/one/id')
  findOne(@Param('id') id: string) {
    return this.experienceService.findOne(+id);
  }

  @Get(':id')
  findByUserId(@Param('user_id') user_id: string) {
    return this.experienceService.findByUserId(+user_id);
  }

  @Patch(':id')
  @Put(':id')
  update(@Param ('id:') id:number,  @Body() updateExperienceDto: UpdateExperienceDto) {
    return this.experienceService.update(+id, updateExperienceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experienceService.remove(+id);
  }
}
