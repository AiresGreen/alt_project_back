import {IsEnum, IsInt, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {language_level_of_language, level} from "@prisma/client";



export class CreateLanguageDto {


    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(language_level_of_language)
    @IsNotEmpty()
    level: language_level_of_language;

}
