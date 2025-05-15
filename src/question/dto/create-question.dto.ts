import {IsInt, IsNotEmpty, IsString} from "class-validator";

export class CreateQuestionDto {

    @IsInt()
    id: number;

    @IsString()
    @IsNotEmpty()
    content: string;



}
