import {IsDate, IsInt, isInt, IsNotEmpty, IsString, Length, Matches} from "class-validator";


export class CreateProfileDto {

    @IsInt()
    id: number;

    @IsString()
    picture: string;

    @IsString()
    street: string;

    @IsString()
    zip_code: string;

    @IsString()
    city: string;

    @IsString()
    @Length(1, 20)
    @Matches(/^\+?[0-9]+$/, { message: 'Numéro invalide' })
    phone_number: string;

    @IsDate()
    createdAt: Date;

    @IsDate()
    updatedAt: Date;
}
