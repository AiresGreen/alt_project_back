import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateSurveyDto {


    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsNotEmpty()
    question: string;

    @IsString()
    @IsOptional()
    answer?: string;

}
