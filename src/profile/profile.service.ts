import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {PrismaService} from "../../prisma/prisma.service";



@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService,) {}


    async create(body: CreateProfileDto) {
        const profile = await this.prisma.profile.findUnique({
            where: {phone_number: body.phone_number},
        });
        if (!profile) throw new NotFoundException(`Profile avec le numéro de téléphone: ${body.phone_number}`);

        return this.prisma.profile.upsert({
            where: {
                phone_number: body.phone_number,
                },
            update: {
            ...profile,
        },
            create: {
                ...profile,
            }
        });
    }

    async findAll() {
        return this.prisma.profile.findMany({});
    }

    findOne(phone_number: string) {
        return this.prisma.profile.findUnique({
            where: {phone_number: phone_number},
        });
    }




    async update(phone_number: string, body: UpdateProfileDto) {
        const profile = await this.prisma.profile.findUnique({
            where: {phone_number: phone_number},
        });
        if (!profile) throw new NotFoundException(`Profile avec le numéro de téléphone: ${body.phone_number}`);

        return this.prisma.profile.upsert({
            where: {phone_number: body.phone_number},
            update: {
                ...profile,
            },
            create: {
                ...profile,
            }
        })
    }



    async remove(phone_number: string) {
        const profile = await this.prisma.profile.findUnique({
            where: {phone_number: phone_number},
        });
        if (!profile) throw new NotFoundException(`Profile avec le numéro de téléphone: ${phone_number}`);

        return this.prisma.profile.delete({
            where: {id: profile.id},
        })
    }



}

