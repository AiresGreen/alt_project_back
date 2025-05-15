import {IsDate, IsNotEmpty, IsString} from "class-validator";

export class CreateCvDto {

    @IsString()
    photo: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    mail: string;

    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    zip: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    phone_number: string;


    @IsDate()
    create_at: Date;

    @IsDate()
    update_at: Date;

}
