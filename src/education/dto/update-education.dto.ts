import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-education.dto';

export class UpdateEducationDto extends PartialType(CreateProjectDto) {}
