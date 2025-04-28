
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../../prisma/prisma.service";
import {user} from "@prisma/client";

export type payload = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;

}

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
        try {
            return this.prisma.user.findUnique({
                where: {
                    email
                },
            });
        } catch (error) {
        console.log(error);
        throw new UnauthorizedException('You shall no pass');
        }
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