
import {Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {UsersService} from "../users/users.service";
import * as argon2 from "argon2";
import {PrismaService} from "../../prisma/prisma.service";
import {SignInDto} from "./dto/sign-in.dto";
import {SignUpDto} from "./dto/sign-up.dto";


export type payload = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;

}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {
    }

    async createUser(body: SignUpDto) {
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


   async signIn(body: SignInDto): Promise<{ access_token: string }> {
        const user = await this.usersService.getByEmail(body.email);
        if (!user || !(await argon2.verify(user.password, body.password))) {
            throw new UnauthorizedException("AS-signIn");
        }
        const payload: payload = {id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname,};
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}

