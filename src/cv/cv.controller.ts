import {Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  create(@Body() createCvDto: CreateCvDto) {
    return this.cvService.create(createCvDto);
  }

  @Get()
  findAll() {
    return this.cvService.findAll();
  }

  @Get(':phone_number')
  findOne(@Param('phone_number') phone_number: string) {
    return this.cvService.findOne(phone_number);
  }

  @Patch(':phone_number')
  @Put(':phone_number')
  update(@Param('phone_number') phone_number: string, @Body() updateCvDto: UpdateCvDto) {
    return this.cvService.update(updateCvDto, phone_number);
  }

  @Delete(':phone_number')
  remove(@Param('phone_number') phone_number: string) {
    return this.cvService.remove(phone_number);
  }
}
