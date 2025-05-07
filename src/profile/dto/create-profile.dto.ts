import {IsDate, IsInt, isInt, IsNotEmpty, IsString} from "class-validator";


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
    @IsNotEmpty()
    phone_number: string;

    @IsDate()
    createdAt: Date;

    @IsDate()
    updatedAt: Date;
}
