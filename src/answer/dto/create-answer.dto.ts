import {IsInt, IsNotEmpty, IsString} from "class-validator";

export class CreateAnswerDto {

    @IsInt()
    id: number;

    @IsString()
    @IsNotEmpty()
    content: string;


}
