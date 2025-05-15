import {IsDate, IsInt, IsNotEmpty, IsString} from "class-validator";

export class CreateProjectDto {

    @IsInt()
    id: number;


    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    place: string;

    @IsString()
    @IsNotEmpty()
    topics: string;

    @IsInt()
    begin_year: number;

    @IsInt()
    end_year: number;

    @IsDate()
    createdAt: Date;

    @IsDate()
    updatedAt: Date;
}
