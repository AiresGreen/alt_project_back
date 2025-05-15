import {IsDate, IsInt, IsNotEmpty, IsString} from "class-validator";

export class CreateExperienceDto {


    @IsInt()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    place: string;

    @IsString()
    @IsNotEmpty()
    topics: string[];

    @IsInt()
    begin_year: number;

    @IsInt()
    end_year: number;

    @IsDate()
    created_at: Date;

    @IsDate()
    updated_at: Date;
}
