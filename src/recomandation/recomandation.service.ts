import { Injectable } from '@nestjs/common';
import { CreateRecomandationDto } from './dto/create-recomandation.dto';
import { UpdateRecomandationDto } from './dto/update-recomandation.dto';

@Injectable()
export class RecomandationService {
  create(createRecomandationDto: CreateRecomandationDto) {
    return 'This action adds a new recomandation';
  }

  findAll() {
    return `This action returns all recomandation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recomandation`;
  }

  update(id: number, updateRecomandationDto: UpdateRecomandationDto) {
    return `This action updates a #${id} recomandation`;
  }

  remove(id: number) {
    return `This action removes a #${id} recomandation`;
  }
}
