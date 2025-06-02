import {Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create(@Body() createSkillDto: CreateSkillDto, id:number, curriculum_vitae_id: number) {
    return this.skillsService.create(createSkillDto, id, curriculum_vitae_id);
  }

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Get('/one/id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(+id);
  }

  @Get(':id')
  findById(@Param('user_id') user_id: string) {
    return this.skillsService.findByUserId(+user_id)
  }

  @Patch(':id')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(+id, updateSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillsService.remove(+id);
  }
}
