import {IsNotEmpty, IsString} from "class-validator";

export class CreateUsefulInfoDto {

    @IsString()
    @IsNotEmpty()
    name: string;

}
