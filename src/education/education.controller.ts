import {Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateProjectDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { Public } from '../auth/decorator/public.decorator'


@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  create(@Body() createEducationDto: CreateProjectDto, curriculum_vitae_id: number) {
    return this.educationService.create(createEducationDto,curriculum_vitae_id);
  }

  @Get()
  findAll() {
    return this.educationService.findAll();
  }


  @Get('/unique/id')
  findOne(@Param('id') id: string) {
    return this.educationService.findOne(+id);
  }

 @Get(':id')
 findByUserId(@Param('user_id') user_id: string) {
    return this.educationService.findByUserId(+user_id);
 }

  @Patch(':id')
  @Put(':id')
  update(@Param ('id:') id:number, @Body() updateEducationDto: UpdateEducationDto) {
    return this.educationService.update(+id, updateEducationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.educationService.remove(+id);
  }
}
