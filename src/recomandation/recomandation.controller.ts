import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecomandationService } from './recomandation.service';
import { CreateRecomandationDto } from './dto/create-recomandation.dto';
import { UpdateRecomandationDto } from './dto/update-recomandation.dto';

@Controller('recomandation')
export class RecomandationController {
  constructor(private readonly recomandationService: RecomandationService) {}

  @Post()
  create(@Body() createRecomandationDto: CreateRecomandationDto) {
    return this.recomandationService.create(createRecomandationDto);
  }

  @Get()
  findAll() {
    return this.recomandationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recomandationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecomandationDto: UpdateRecomandationDto) {
    return this.recomandationService.update(+id, updateRecomandationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recomandationService.remove(+id);
  }
}
