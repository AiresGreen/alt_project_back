import {IsDate, IsInt, IsNotEmpty, IsString} from "class-validator";

export class CreateProjectDto {

    @IsString()
    @IsNotEmpty()
    name: string;


    @IsString()
    @IsNotEmpty()
    place: string;


    @IsString()
    @IsNotEmpty()
    results: string;

    @IsInt()
    year_of_beginning: Date;

    @IsInt()
    end_year: Date;

    @IsDate()
    created_at: Date;

    @IsDate()
    updated_at: Date;
}
