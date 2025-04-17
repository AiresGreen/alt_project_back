import {IsEmail, IsInt, IsNotEmpty, IsString} from "class-validator";


export class SignUpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsInt()
    @IsNotEmpty()
    profilId: number;


    @IsInt()
    @IsNotEmpty()
    levelId: number;
}
