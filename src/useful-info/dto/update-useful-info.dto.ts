import { PartialType } from '@nestjs/mapped-types';
import { CreateUsefulInfoDto } from './create-useful-info.dto';

export class UpdateUsefulInfoDto extends PartialType(CreateUsefulInfoDto) {}
