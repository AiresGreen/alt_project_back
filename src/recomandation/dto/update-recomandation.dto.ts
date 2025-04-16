import { PartialType } from '@nestjs/mapped-types';
import { CreateRecomandationDto } from './create-recomandation.dto';

export class UpdateRecomandationDto extends PartialType(CreateRecomandationDto) {}
