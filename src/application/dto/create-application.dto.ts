import {IsDate, IsInt, IsString} from "class-validator";

export class CreateApplicationDto {

    @IsInt()
    id: number;

    @IsDate()
    send_date: Date;

    @IsString()
    received_return?: string;

}
