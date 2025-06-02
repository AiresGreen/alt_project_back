import {Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { HobbiesService } from './hobbies.service';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto } from './dto/update-hobby.dto';

@Controller('hobbies')
export class HobbiesController {
  constructor(private readonly hobbiesService: HobbiesService) {}

  @Post()
  create(@Body() createHobbyDto: CreateHobbyDto, id:number, curriculum_vitae_id: number) {
    return this.hobbiesService.create(createHobbyDto, id, curriculum_vitae_id);
  }

  @Get()
  findAll() {
    return this.hobbiesService.findAll();
  }

  @Get('/one/id')
  findOne(@Param('id') id: string) {
    return this.hobbiesService.findOne(+id);
  }

  @Get(':id')
  findByUserId(@Param('user_id') user_id: string) {
    return this.hobbiesService.findByUserId(+user_id);
  }

  @Patch(':id')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateHobbyDto: UpdateHobbyDto) {
    return this.hobbiesService.update(+id, updateHobbyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hobbiesService.remove(+id);
  }
}
