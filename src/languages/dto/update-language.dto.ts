import { PartialType } from '@nestjs/mapped-types';
import { CreateLanguageDto } from './create-language.dto';
import {IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {language_level_of_language} from "@prisma/client";

export class UpdateLanguageDto {
    @IsString()
    @IsOptional()
    langEnglishName?: string;


    @IsEnum(language_level_of_language)
    @IsOptional()
    level?: language_level_of_language;
}