
import {Injectable, InternalServerErrorException} from '@nestjs/common';
import * as argon2 from 'argon2';
import {PrismaService} from "../../prisma/prisma.service";
import {user} from "@prisma/client";


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {
    }

    findAll() {
        return this.prisma.user.findMany({
            include: {
                profil: true,
                level: true,
            },
        });
    }


    async getByEmail(email: string): Promise<user | null> {
        return this.prisma.user.findUnique({
            where: {
                email
            }
        })
    }
}

    /*async createUser(body: {
        email: string;
        password: string;
        firstname: string;
        lastname: string;
        profilId: number;
        levelId: number;
    }) {
        const hashedPassword = await argon2.hash(body.password);
        try{
            return await this.prisma.user.create({
                data: {
                    email: body.email,
                    password: hashedPassword,
                    firstname: body.firstname,
                    lastname: body.lastname,
                    profil: {
                        connect: {id: Number(body.profilId)},
                    },
                    level: {
                        connect: {id: Number(body.levelId)},
                    },
                },
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("User already exists");
        }
    }
}*/ //transfer dans auth