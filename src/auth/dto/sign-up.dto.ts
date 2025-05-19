import {IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {level_grade} from "@prisma/client";


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

    @IsOptional()
    @IsInt()
    profil_id?: number;

    @IsOptional()
    @IsInt()
    level_id?: number;

    @IsOptional()
    @IsEnum(level_grade)
    level?: level_grade;

    @IsOptional()
    @IsString()
    emailVerified?: boolean


}
