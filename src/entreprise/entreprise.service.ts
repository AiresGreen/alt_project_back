import { Injectable } from '@nestjs/common';
import { CreateEntrepriseDto } from './dto/create-entreprise.dto';
import { UpdateEntrepriseDto } from './dto/update-entreprise.dto';

@Injectable()
export class EntrepriseService {
  create(createEntrepriseDto: CreateEntrepriseDto) {
    return 'This action adds a new entreprise';
  }

  findAll() {
    return `This action returns all entreprise`;
  }

  findOne(id: number) {
    return `This action returns a #${id} entreprise`;
  }

  update(id: number, updateEntrepriseDto: UpdateEntrepriseDto) {
    return `This action updates a #${id} entreprise`;
  }

  remove(id: number) {
    return `This action removes a #${id} entreprise`;
  }
}
