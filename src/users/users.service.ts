
import { Injectable } from '@nestjs/common';
import {PrismaService} from "../../prisma/prisma.service";
import {user} from "@prisma/client";




@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    findAll() {
        return this.prisma.user.findMany({
            include: {
                profil: true,
                level: true,
            },
        });
    }


    async getByEmail(email: string): Promise<user| null> {
        return this.prisma.user.findUnique({
            where: {
                email
            }
        })
    }
}
