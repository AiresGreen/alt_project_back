import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsefulInfoService } from './useful-info.service';
import { CreateUsefulInfoDto } from './dto/create-useful-info.dto';
import { UpdateUsefulInfoDto } from './dto/update-useful-info.dto';

@Controller('useful-info')
export class UsefulInfoController {
  constructor(private readonly usefulInfoService: UsefulInfoService) {}

  @Post()
  create(@Body() createUsefulInfoDto: CreateUsefulInfoDto, id:number, curriculum_vitae_id: number) {
    return this.usefulInfoService.create(createUsefulInfoDto, id, curriculum_vitae_id);
  }

  @Get()
  findAll() {
    return this.usefulInfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usefulInfoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUsefulInfoDto: UpdateUsefulInfoDto) {
    return this.usefulInfoService.update(+id, updateUsefulInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usefulInfoService.remove(+id);
  }
}
