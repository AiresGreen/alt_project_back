import {ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UsersService} from "../users/users.service";
import * as argon2 from "argon2";
import {PrismaService} from "../../prisma/prisma.service";
import {SignInDto} from "./dto/sign-in.dto";
import {SignUpDto} from "./dto/sign-up.dto";
import {ConfigService} from "@nestjs/config";
import * as crypto from "crypto";
import {MailService} from "../mail/mail.service";



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
        private mailService: MailService,
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


    async sendEmailVerification(user: any) {
        const token = crypto.randomBytes(32).toString('hex');

        await this.prisma.emailVerificationToken.create({
            data: {
                token,
                user: { connect: { id: user.id } },
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h,
            },
        });

        await this.mailService.sendVerificationEmail(user.email, token);
        console.log("🚀 ~ sendEmailVerification ~ this.mailService: ", this.mailService);


    }


    async signIn(body: SignInDto)/*: Promise<{ access_token: string, refresh_token:string }>*/ {
        const user = await this.usersService.getByEmail(body.email);
        if (!user || !(await argon2.verify(user.password, body.password))) {
            throw new UnauthorizedException("AS-signIn");
        }
        return user;
    }


    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !(await argon2.verify(user.password, password))) {
            throw new UnauthorizedException('Invalid credentials');
        } else if (!user.emailVerified) {
            throw new ForbiddenException("Tu dois d'abord valider ton adresse email.");
        }
        return user;
    }

    async login(user: any) {
        return await this.generateTokens(user);
    }

    async generateTokens(user: any) {
        const payload = {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            hashedRt: user.hashedRt
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.config.get('JWT_ACCESS_SECRET'),
            expiresIn: '3h',
        });
        //console.log("🚀 ~ generateTokens ~ accessToken: ", accessToken);

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.config.get('JWT_REFRESH_SECRET'),
            expiresIn: '1d',
        });
        //console.log("🚀 ~ generateTokens ~ refreshToken: ", refreshToken);

        const hashedRt: string = await argon2.hash(refreshToken)
       // console.log("🚀 ~ generateTokens ~ hashedRt: ", hashedRt)

        await this.prisma.user.upsert({
            where: {email: user.email},
            update: {hashedRt},
            create: {
                ...user
            },
            });


        return {
            accessToken,
            refreshToken,
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

