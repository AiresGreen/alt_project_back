import {IsNotEmpty, IsString} from "class-validator";

export class CreateHobbyDto {

    @IsString()
    @IsNotEmpty()
    name: string;

}
