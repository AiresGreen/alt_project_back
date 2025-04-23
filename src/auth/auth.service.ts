import {ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UsersService} from "../users/users.service";
import * as argon2 from "argon2";
import {PrismaService} from "../../prisma/prisma.service";
import {SignInDto} from "./dto/sign-in.dto";
import {SignUpDto} from "./dto/sign-up.dto";
import {ConfigService} from "@nestjs/config";


export type payload = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    hashedRt: string;

}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) {
    }

    async createUser(body: SignUpDto) {
        const hashedPassword = await argon2.hash(body.password);
        try {
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


    async signIn(body: SignInDto)/*: Promise<{ access_token: string, refresh_token:string }>*/ {
        const user = await this.usersService.getByEmail(body.email);
        if (!user || !(await argon2.verify(user.password, body.password))) {
            throw new UnauthorizedException("AS-signIn");
        }
        /*        const payload: payload = {id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname,};
                return {
                    access_token: await this.jwtService.signAsync(payload),
                    refresh_token: await this.jwtService.signAsync(payload),*/
        return user;
    }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !(await argon2.verify(user.password, password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }

    async login(user: any) {
        const tokens = await this.generateTokens(user);
        return tokens;
    }

    async generateTokens(user: any) {
        const payload = {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            hashedRt: user.hashedRt,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.config.get('JWT_ACCESS_SECRET'),
            expiresIn: '15m',
        });
        console.log("🚀 ~ generateTokens ~ accessToken: ", accessToken);

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.config.get('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });
        console.log("🚀 ~ generateTokens ~ refreshToken: ", refreshToken);

        const hashedRt: string = await argon2.hash(refreshToken)
        console.log("🚀 ~ generateTokens ~ hashedRt: ", hashedRt)

        await this.prisma.user.update({
            where: {email: user.email},
            data: {hashedRt}
            });



        return {
            accessToken,
            refreshToken,
            hashedRt,
        };

    }

    async refreshToken(email: string, refreshToken: string) {
        const user = await this.prisma.user.findUnique({
            where: { email},
        });


        if (!user) throw new ForbiddenException('Access Denied');

        return this.generateTokens(user);
    }



}

